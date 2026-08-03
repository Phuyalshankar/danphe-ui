import Foundation
import Network

/**
 📡 DolphinHotPatchClient (iOS)
 
 Connects to the Dolphin Dev Server over TCP and receives binary patches.
 Ported from HotPatchClient.kt.
 */
final class DolphinHotPatchClient {
    
    enum Command: UInt8 {
        case fullReload     = 0x01
        case patchScreen    = 0x02
        case patchComponent = 0x03
        case ping            = 0x04
        case pong            = 0x05
        case ack             = 0x06
    }
    
    protocol Delegate: AnyObject {
        func hotPatchClient(_ client: DolphinHotPatchClient, didReceiveFullReload data: Data)
        func hotPatchClient(_ client: DolphinHotPatchClient, didPatchScreen name: String, data: Data)
        func hotPatchClient(_ client: DolphinHotPatchClient, didPatchComponent index: Int, binary: Data)
        func hotPatchClientDidDisconnect(_ client: DolphinHotPatchClient)
    }
    
    weak var delegate: Delegate?
    private var connection: NWConnection?
    private let queue = DispatchQueue(label: "io.dolphin.hotpatch")
    
    func connect(host: String, port: Int) {
        let endpoint = NWEndpoint.hostPort(host: NWEndpoint.Host(host), port: NWEndpoint.Port(integerLiteral: UInt16(port)))
        let parameters = NWParameters.tcp
        
        connection = NWConnection(to: endpoint, using: parameters)
        connection?.stateUpdateHandler = { state in
            switch state {
            case .ready:
                print("🌊 DolphinHotPatch: Connected to \(host):\(port)")
                self.receiveMessage()
            case .failed(let error):
                print("❌ DolphinHotPatch: Connection failed: \(error)")
                self.delegate?.hotPatchClientDidDisconnect(self)
            case .cancelled:
                print("❌ DolphinHotPatch: Connection cancelled")
            default:
                break
            }
        }
        connection?.start(queue: queue)
    }
    
    func disconnect() {
        connection?.cancel()
    }
    
    private func receiveMessage() {
        // 1. Read 5-byte header: [CMD(1)] [PAYLOAD_LEN(4)]
        connection?.receive(minimumIncompleteLength: 5, maximumLength: 5) { data, _, isComplete, error in
            if let error = error {
                print("❌ DolphinHotPatch: Receive error: \(error)")
                return
            }
            
            guard let data = data, data.count == 5 else {
                if isComplete { self.delegate?.hotPatchClientDidDisconnect(self) }
                return
            }
            
            let cmdByte = data[0]
            let payloadLen = UInt32(data[1]) | (UInt32(data[2]) << 8) | (UInt32(data[3]) << 16) | (UInt32(data[4]) << 24)
            
            if payloadLen > 0 {
                // 2. Read payload
                self.connection?.receive(minimumIncompleteLength: Int(payloadLen), maximumLength: Int(payloadLen)) { payload, _, _, _ in
                    if let payload = payload {
                        self.handleMessage(cmd: cmdByte, payload: payload)
                    }
                    self.receiveMessage()
                }
            } else {
                self.handleMessage(cmd: cmdByte, payload: Data())
                self.receiveMessage()
            }
        }
    }
    
    private func handleMessage(cmd: UInt8, payload: Data) {
        guard let command = Command(rawValue: cmd) else { return }
        
        switch command {
        case .fullReload:
            delegate?.hotPatchClient(self, didReceiveFullReload: payload)
            sendAck(info: "FULL_RELOAD")
            
        case .patchScreen:
            let nameLen = Int(payload[0])
            let name = String(data: payload[1..<(1+nameLen)], encoding: .utf8) ?? ""
            let screenData = payload.subdata(in: (1+nameLen)..<payload.count)
            delegate?.hotPatchClient(self, didPatchScreen: name, data: screenData)
            sendAck(info: "PATCH_SCREEN:\(name)")
            
        case .patchComponent:
            let index = Int(payload[0]) | (Int(payload[1]) << 8)
            let binary = payload.subdata(in: 2..<18)
            delegate?.hotPatchClient(self, didPatchComponent: index, binary: binary)
            sendAck(info: "PATCH_COMPONENT:\(index)")
            
        case .ping:
            sendPong()
            
        default:
            break
        }
    }
    
    private func sendAck(info: String) {
        let infoData = info.data(using: .utf8) ?? Data()
        var msg = Data([Command.ack.rawValue])
        let len = UInt32(infoData.count)
        msg.append(contentsOf: [UInt8(len & 0xFF), UInt8((len >> 8) & 0xFF), UInt8((len >> 16) & 0xFF), UInt8((len >> 24) & 0xFF)])
        msg.append(infoData)
        send(msg)
    }
    
    private func sendPong() {
        let msg = Data([Command.pong.rawValue, 0, 0, 0, 0])
        send(msg)
    }
    
    private func send(_ data: Data) {
        connection?.send(content: data, completion: .contentProcessed({ error in
            if let error = error { print("❌ DolphinHotPatch: Send error: \(error)") }
        }))
    }
}
