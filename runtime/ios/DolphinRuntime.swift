import Foundation
import UIKit

// ─────────────────────────────────────────────────────────────────────────────
// DOLPHIN BINARY PROTOCOL — iOS/Swift side
// Mirrors DolphinBinaryProtocol.js and BinaryParser.kt exactly.
// ─────────────────────────────────────────────────────────────────────────────

// MARK: - Data Models

class DolphinBundle {
    let magic:         String
    let version:       Int
    let flags:         Int
    var screens:       [DolphinScreen]
    var components:    [Data]       // each entry == 16 bytes Titan binary
    let checksumValid: Bool
    
    init(magic: String, version: Int, flags: Int, screens: [DolphinScreen], components: [Data], checksumValid: Bool) {
        self.magic = magic; self.version = version; self.flags = flags
        self.screens = screens; self.components = components; self.checksumValid = checksumValid
    }
    
    func patchScreen(name: String, data: Data) {
        if let idx = screens.firstIndex(where: { $0.name == name }) {
            let s = screens[idx]
            screens[idx] = DolphinScreen(name: s.name, componentOffset: s.componentOffset, 
                                         componentCount: s.componentCount, rawData: data)
        }
    }
    
    func patchComponent(index: Int, binary: Data) {
        if index < components.count && binary.count == 16 {
            components[index] = binary
        }
    }
}

struct DolphinScreen {
    let name:            String
    let componentOffset: Int
    let componentCount:  Int
    let rawData:         Data
}

// MARK: - Binary Parser

final class DolphinBinaryParser {

    enum ParseError: Error {
        case tooSmall
        case invalidMagic(String)
        case outOfBounds(String)
    }

    func parse(_ data: Data) throws -> DolphinBundle {
        guard data.count >= 24 else { throw ParseError.tooSmall }

        var cursor = 0

        // ── MAGIC (4 bytes) ─────────────────────────────────
        let magicBytes = data[cursor..<cursor+4]
        let magic      = String(bytes: magicBytes, encoding: .ascii) ?? ""
        guard magic == "DOLP" else { throw ParseError.invalidMagic(magic) }
        cursor += 4

        // ── HEADER ──────────────────────────────────────────
        let version   = readUInt16LE(data, at: cursor); cursor += 2
        let flags     = readUInt16LE(data, at: cursor); cursor += 2
        let scrCount  = readUInt16LE(data, at: cursor); cursor += 2
        let compCount = readUInt16LE(data, at: cursor); cursor += 2
        cursor += 8  // reserved

        // ── SCREENS ─────────────────────────────────────────
        var screens = [DolphinScreen]()
        for _ in 0..<scrCount {
            guard cursor < data.count else { throw ParseError.outOfBounds("screen name length") }
            let nameLen = Int(data[cursor]); cursor += 1
            guard cursor + nameLen <= data.count else { throw ParseError.outOfBounds("screen name") }
            let name    = String(bytes: data[cursor..<cursor+nameLen], encoding: .utf8) ?? ""; cursor += nameLen
            let compOff = readUInt16LE(data, at: cursor); cursor += 2
            let compCnt = readUInt16LE(data, at: cursor); cursor += 2
            let dataLen = Int(readUInt32LE(data, at: cursor)); cursor += 4
            guard cursor + dataLen <= data.count else { throw ParseError.outOfBounds("screen data") }
            let raw     = data[cursor..<cursor+dataLen]; cursor += dataLen
            screens.append(DolphinScreen(name: name, componentOffset: compOff, componentCount: compCnt, rawData: raw))
        }

        // ── TITAN COMPONENT TABLE ────────────────────────────
        var components = [Data]()
        for _ in 0..<compCount {
            guard cursor + 16 <= data.count - 4 else { break }
            components.append(data[cursor..<cursor+16])
            cursor += 16
        }

        // ── CHECKSUM ─────────────────────────────────────────
        let bodyEnd  = data.count - 4
        let expected = readUInt32LE(data, at: bodyEnd)
        let actual   = xor32(data, from: 0, to: bodyEnd)
        let checksumValid = expected == actual

        if !checksumValid {
            print("⚠️ DolphinBinaryParser: checksum mismatch — bundle may be corrupted")
        }

        return DolphinBundle(magic: magic, version: version, flags: flags,
                             screens: screens, components: components, checksumValid: checksumValid)
    }

    // MARK: Binary helpers

    private func readUInt16LE(_ data: Data, at offset: Int) -> Int {
        guard offset + 1 < data.count else { return 0 }
        return Int(data[offset]) | (Int(data[offset+1]) << 8)
    }

    private func readUInt32LE(_ data: Data, at offset: Int) -> UInt32 {
        guard offset + 3 < data.count else { return 0 }
        return UInt32(data[offset])
             | (UInt32(data[offset+1]) << 8)
             | (UInt32(data[offset+2]) << 16)
             | (UInt32(data[offset+3]) << 24)
    }

    private func xor32(_ data: Data, from start: Int, to end: Int) -> UInt32 {
        var checksum: UInt32 = 0
        var i = start
        while i + 3 < end {
            let word = UInt32(data[i])
                     | (UInt32(data[i+1]) << 8)
                     | (UInt32(data[i+2]) << 16)
                     | (UInt32(data[i+3]) << 24)
            checksum ^= word
            i += 4
        }
        let rem = (end - start) % 4
        if rem > 0 {
            var tail: UInt32 = 0
            for j in 0..<rem { tail |= UInt32(data[end-rem+j]) << (j*8) }
            checksum ^= tail
        }
        return checksum
    }
}

// MARK: - View Factory

/// Maps Dolphin 16-byte Titan binary component codes to UIKit views.
final class DolphinViewFactory {

    // Component type codes — matches DolphinBinaryProtocol.js exactly
    private enum ComponentType: UInt8 {
        case button    = 0x10
        case card      = 0x11
        case container = 0x12
        case column    = 0x13
        case row       = 0x14
        case stack     = 0x15
        case text      = 0x16
        case image     = 0x17
        case textField = 0x18
        case slider    = 0x19
        case toggle    = 0x1A
        case appBar    = 0x1B
        case listView  = 0x1C
        case gridView  = 0x1D
        case modal     = 0x1E
        case form      = 0x1F
        case camera    = 0x20
        case microphone = 0x21
        case location  = 0x22
        case bluetooth = 0x23
        case haptics   = 0x24
        case battery   = 0x25
        case sensors   = 0x26
        case webrtcVideo = 0x27
        case webrtcAudio = 0x28
    }

    private enum AnimationType: UInt8 {
        case none = 0x00, fade = 0x01, slide = 0x02, scale = 0x03, rotate = 0x04, bounce = 0x05
    }

    func buildScreen(_ screen: DolphinScreen, allComponents: [Data]) -> UIView {
        let root = UIScrollView()
        root.translatesAutoresizingMaskIntoConstraints = false

        let stack = UIStackView()
        stack.axis       = .vertical
        stack.spacing    = 0
        stack.translatesAutoresizingMaskIntoConstraints = false
        root.addSubview(stack)

        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: root.topAnchor),
            stack.leadingAnchor.constraint(equalTo: root.leadingAnchor),
            stack.trailingAnchor.constraint(equalTo: root.trailingAnchor),
            stack.bottomAnchor.constraint(equalTo: root.bottomAnchor),
            stack.widthAnchor.constraint(equalTo: root.widthAnchor),
        ])

        let start = screen.componentOffset
        let end   = min(start + screen.componentCount, allComponents.count)
        for i in start..<end {
            let titan = allComponents[i]
            if titan.count >= 16 {
                let view = fromTitan(titan)
                stack.addArrangedSubview(view)
            }
        }

        print("🌊 DolphinViewFactory: built screen '\(screen.name)' (\(end-start) components)")
        return root
    }

    func fromTitan(_ bin: Data) -> UIView {
        guard bin.count >= 16 else { return UIView() }

        let compType = bin[1]
        let view: UIView

        switch ComponentType(rawValue: compType) {
        case .button:    view = makeButton(bin)
        case .card:      view = makeCard(bin)
        case .container: view = makeContainer(bin)
        case .column:    view = makeColumn(bin)
        case .row:       view = makeRow(bin)
        case .text:      view = makeText(bin)
        case .image:     view = makeImage(bin)
        case .textField: view = makeTextField(bin)
        case .slider:    view = makeSlider(bin)
        case .toggle:    view = makeToggle(bin)
        case .appBar:    view = makeAppBar(bin)
        case .listView:  view = makeListPlaceholder(bin)
        case .modal:     view = makeModal(bin)
        case .camera:    view = makeCamera(bin)
        case .microphone: view = makeMicrophone(bin)
        case .location:  view = makeLocation(bin)
        case .bluetooth: view = makeBluetooth(bin)
        case .haptics:   view = makeHaptics(bin)
        case .battery:   view = makeBattery(bin)
        case .sensors:   view = makeSensors(bin)
        case .webrtcVideo: view = makeWebRTCVideo(bin)
        case .webrtcAudio: view = makeWebRTCAudio(bin)
        default:
            print("⚠️ Unknown component type: 0x\(String(compType, radix: 16))")
            view = makeFallback(bin)
        }

        applyCommonProps(view, bin: bin)
        applyAnimation(view, bin: bin)
        return view
    }

    // MARK: Component Builders

    private func makeButton(_ bin: Data) -> UIView {
        let btn = UIButton(type: .system)
        btn.setTitle("Button", for: .normal)
        btn.backgroundColor = UIColor(red: 0.12, green: 0.53, blue: 0.90, alpha: 1) // #1E88E5
        btn.setTitleColor(.white, for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        btn.layer.cornerRadius = 8
        btn.heightAnchor.constraint(equalToConstant: 48).isActive = true
        return btn
    }

    private func makeCard(_ bin: Data) -> UIView {
        let card = UIView()
        card.backgroundColor     = .white
        card.layer.cornerRadius  = 12
        card.layer.shadowColor   = UIColor.black.cgColor
        card.layer.shadowOpacity = 0.12
        card.layer.shadowRadius  = 8
        card.layer.shadowOffset  = CGSize(width: 0, height: 2)
        card.heightAnchor.constraint(equalToConstant: 96).isActive = true
        return card
    }

    private func makeContainer(_ bin: Data) -> UIView {
        let v = UIView()
        v.heightAnchor.constraint(equalToConstant: 64).isActive = true
        return v
    }

    private func makeColumn(_ bin: Data) -> UIStackView {
        let s = UIStackView()
        s.axis    = .vertical
        s.spacing = 8
        return s
    }

    private func makeRow(_ bin: Data) -> UIStackView {
        let s = UIStackView()
        s.axis    = .horizontal
        s.spacing = 8
        return s
    }

    private func makeText(_ bin: Data) -> UILabel {
        let l = UILabel()
        l.text      = "Text"
        l.font      = .systemFont(ofSize: 16)
        l.textColor = .darkGray
        l.numberOfLines = 0
        return l
    }

    private func makeImage(_ bin: Data) -> UIImageView {
        let iv = UIImageView()
        iv.backgroundColor     = .systemGray5
        iv.contentMode         = .scaleAspectFill
        iv.clipsToBounds       = true
        iv.layer.cornerRadius  = 8
        iv.heightAnchor.constraint(equalToConstant: 200).isActive = true
        return iv
    }

    private func makeTextField(_ bin: Data) -> UITextField {
        let tf = UITextField()
        tf.placeholder   = "Enter text..."
        tf.borderStyle   = .roundedRect
        tf.backgroundColor = UIColor.systemGray6
        return tf
    }

    private func makeSlider(_ bin: Data) -> UISlider {
        let s = UISlider()
        s.value = 0.5
        s.minimumTrackTintColor = UIColor(red: 0.12, green: 0.53, blue: 0.90, alpha: 1)
        return s
    }

    private func makeToggle(_ bin: Data) -> UISwitch {
        let sw = UISwitch()
        sw.onTintColor = UIColor(red: 0.12, green: 0.53, blue: 0.90, alpha: 1)
        return sw
    }

    private func makeAppBar(_ bin: Data) -> UIView {
        let bar   = UIView()
        bar.backgroundColor = UIColor(red: 0.08, green: 0.33, blue: 0.75, alpha: 1) // #1565C0
        bar.heightAnchor.constraint(equalToConstant: 56).isActive = true
        let title = UILabel()
        title.text      = "App Title"
        title.textColor = .white
        title.font      = .systemFont(ofSize: 20, weight: .bold)
        title.translatesAutoresizingMaskIntoConstraints = false
        bar.addSubview(title)
        NSLayoutConstraint.activate([
            title.leadingAnchor.constraint(equalTo: bar.leadingAnchor, constant: 16),
            title.centerYAnchor.constraint(equalTo: bar.centerYAnchor),
        ])
        return bar
    }

    private func makeListPlaceholder(_ bin: Data) -> UIView {
        let t = UITableView()
        t.heightAnchor.constraint(equalToConstant: 300).isActive = true
        return t
    }

    private func makeModal(_ bin: Data) -> UIView {
        let m = UIView()
        m.backgroundColor = UIColor.black.withAlphaComponent(0.5)
        return m
    }

    private func makeFallback(_ bin: Data) -> UIView {
        let v = UIView()
        v.backgroundColor = UIColor(red: 1, green: 0.87, blue: 0.87, alpha: 1)
        v.heightAnchor.constraint(equalToConstant: 48).isActive = true
        return v
    }

    private func makeCamera(_ bin: Data) -> UIView {
        let v = UIView()
        v.backgroundColor = .black
        v.heightAnchor.constraint(equalToConstant: 200).isActive = true
        let l = UILabel()
        l.text = "📷 Camera View"
        l.textColor = .white
        l.textAlignment = .center
        l.translatesAutoresizingMaskIntoConstraints = false
        v.addSubview(l)
        NSLayoutConstraint.activate([
            l.centerXAnchor.constraint(equalTo: v.centerXAnchor),
            l.centerYAnchor.constraint(equalTo: v.centerYAnchor)
        ])
        return v
    }

    private func makeMicrophone(_ bin: Data) -> UIView {
        let btn = UIButton(type: .system)
        btn.setTitle("🎤 Microphone", for: .normal)
        btn.backgroundColor = UIColor(red: 0.26, green: 0.63, blue: 0.28, alpha: 1) // #43A047
        btn.setTitleColor(.white, for: .normal)
        btn.layer.cornerRadius = 8
        btn.heightAnchor.constraint(equalToConstant: 48).isActive = true
        return btn
    }

    private func makeLocation(_ bin: Data) -> UIView {
        let l = UILabel()
        l.text = "📍 Location tracking enabled"
        l.textColor = .darkGray
        return l
    }

    private func makeBluetooth(_ bin: Data) -> UIView {
        let btn = UIButton(type: .system)
        btn.setTitle("🦷 Bluetooth Connect", for: .normal)
        btn.backgroundColor = UIColor(red: 0.08, green: 0.40, blue: 0.75, alpha: 1) // #1565C0
        btn.setTitleColor(.white, for: .normal)
        btn.layer.cornerRadius = 8
        btn.heightAnchor.constraint(equalToConstant: 48).isActive = true
        return btn
    }

    private func makeHaptics(_ bin: Data) -> UIView {
        let v = UIView()
        v.heightAnchor.constraint(equalToConstant: 0).isActive = true
        v.isHidden = true
        return v
    }

    private func makeBattery(_ bin: Data) -> UIView {
        let v = UIView()
        v.backgroundColor = UIColor.systemGreen.withAlphaComponent(0.2)
        v.heightAnchor.constraint(equalToConstant: 40).isActive = true
        let l = UILabel()
        l.text = "🔋 Battery 100%"
        l.textColor = .systemGreen
        l.textAlignment = .center
        l.font = .boldSystemFont(ofSize: 14)
        l.translatesAutoresizingMaskIntoConstraints = false
        v.addSubview(l)
        NSLayoutConstraint.activate([
            l.centerXAnchor.constraint(equalTo: v.centerXAnchor),
            l.centerYAnchor.constraint(equalTo: v.centerYAnchor)
        ])
        v.layer.cornerRadius = 20
        return v
    }

    private func makeSensors(_ bin: Data) -> UIView {
        let v = UIView()
        v.heightAnchor.constraint(equalToConstant: 0).isActive = true
        v.isHidden = true
        return v
    }

    private func makeWebRTCVideo(_ bin: Data) -> UIView {
        let v = UIView()
        v.backgroundColor = .darkGray
        v.heightAnchor.constraint(equalToConstant: 300).isActive = true
        v.layer.cornerRadius = 12
        v.clipsToBounds = true
        
        let l = UILabel()
        l.text = "📹 WebRTC Video Stream"
        l.textColor = .white
        l.textAlignment = .center
        l.font = .systemFont(ofSize: 18, weight: .medium)
        l.translatesAutoresizingMaskIntoConstraints = false
        v.addSubview(l)
        NSLayoutConstraint.activate([
            l.centerXAnchor.constraint(equalTo: v.centerXAnchor),
            l.centerYAnchor.constraint(equalTo: v.centerYAnchor)
        ])
        return v
    }

    private func makeWebRTCAudio(_ bin: Data) -> UIView {
        let v = UIView()
        v.backgroundColor = UIColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1)
        v.heightAnchor.constraint(equalToConstant: 80).isActive = true
        v.layer.cornerRadius = 40
        
        let l = UILabel()
        l.text = "🎧 WebRTC Audio Active"
        l.textColor = UIColor(red: 0.3, green: 0.9, blue: 0.4, alpha: 1)
        l.textAlignment = .center
        l.font = .systemFont(ofSize: 14, weight: .bold)
        l.translatesAutoresizingMaskIntoConstraints = false
        v.addSubview(l)
        NSLayoutConstraint.activate([
            l.centerXAnchor.constraint(equalTo: v.centerXAnchor),
            l.centerYAnchor.constraint(equalTo: v.centerYAnchor)
        ])
        return v
    }

    // MARK: Common Property Applicators

    private func applyCommonProps(_ view: UIView, bin: Data) {
        // Padding (bytes 4..7) — approximate with layoutMargins
        let pT = CGFloat(bin[4]), pR = CGFloat(bin[5]), pB = CGFloat(bin[6]), pL = CGFloat(bin[7])
        view.layoutMargins = UIEdgeInsets(top: pT, left: pL, bottom: pB, right: pR)

        // Opacity (byte 14)
        view.alpha = CGFloat(bin[14]) / 255.0
    }

    private func applyAnimation(_ view: UIView, bin: Data) {
        let animType = bin[12]
        let animDur  = max(0.1, Double(bin[13]) / 255.0 * 5.0)

        guard animType != 0x00 else { return }

        view.alpha = 0
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
            switch animType {
            case 0x01: // fade
                UIView.animate(withDuration: animDur) { view.alpha = CGFloat(bin[14]) / 255.0 }
            case 0x02: // slide
                view.transform = CGAffineTransform(translationX: 0, y: 60)
                UIView.animate(withDuration: animDur, options: .curveEaseOut) {
                    view.alpha     = CGFloat(bin[14]) / 255.0
                    view.transform = .identity
                }
            case 0x03: // scale
                view.transform = CGAffineTransform(scaleX: 0.5, y: 0.5)
                UIView.animate(withDuration: animDur, options: .curveEaseOut) {
                    view.alpha     = CGFloat(bin[14]) / 255.0
                    view.transform = .identity
                }
            case 0x05: // bounce
                view.transform = CGAffineTransform(translationX: 0, y: -30)
                UIView.animate(withDuration: animDur,
                               delay: 0, usingSpringWithDamping: 0.5,
                               initialSpringVelocity: 1, options: .curveEaseOut) {
                    view.alpha     = CGFloat(bin[14]) / 255.0
                    view.transform = .identity
                }
            default:
                view.alpha = CGFloat(bin[14]) / 255.0
            }
        }
    }
}

// MARK: - Dolphin Runtime

/**
 🌊 Dolphin Native Runtime (iOS)
 
 Entry point for the Dolphin Binary Platform on iOS.
 Matches DolphinRuntime.kt implementation.
 */
public final class DolphinRuntime {
    
    private let parser = DolphinBinaryParser()
    private let viewFactory = DolphinViewFactory()
    private var bundle: DolphinBundle?
    private var hotPatch: DolphinHotPatchClient?
    
    public init() {}
    
    public func load(from data: Data) {
        do {
            self.bundle = try parser.parse(data)
            print("🌊 Dolphin: Bundle loaded (\(bundle?.screens.count ?? 0) screens)")
        } catch {
            print("❌ Dolphin: Load failed: \(error)")
        }
    }
    
    public func buildScreen(_ name: String) -> UIView {
        guard let b = bundle else { return UIView() }
        guard let screen = b.screens.first(where: { $0.name == name }) else {
            print("❌ Dolphin: Screen '\(name)' not found")
            return UIView()
        }
        return viewFactory.buildScreen(screen, allComponents: b.components)
    }
    
    // MARK: Hot Patching
    
    public func connectDevServer(host: String = "127.0.0.1", port: Int = 7788, onRefresh: @escaping (String?) -> Void) {
        hotPatch = DolphinHotPatchClient()
        hotPatch?.delegate = self
        hotPatch?.connect(host: host, port: port)
        
        // Store refresh callback
        self.onRefresh = onRefresh
    }
    
    private var onRefresh: ((String?) -> Void)?
}

extension DolphinRuntime: DolphinHotPatchClient.Delegate {
    public func hotPatchClient(_ client: DolphinHotPatchClient, didReceiveFullReload data: Data) {
        self.load(from: data)
        DispatchQueue.main.async { self.onRefresh?(nil) }
    }
    
    public func hotPatchClient(_ client: DolphinHotPatchClient, didPatchScreen name: String, data: Data) {
        bundle?.patchScreen(name: name, data: data)
        DispatchQueue.main.async { self.onRefresh?(name) }
    }
    
    public func hotPatchClient(_ client: DolphinHotPatchClient, didPatchComponent index: Int, binary: Data) {
        bundle?.patchComponent(index: index, binary: binary)
        DispatchQueue.main.async { self.onRefresh?(nil) }
    }
    
    public func hotPatchClientDidDisconnect(_ client: DolphinHotPatchClient) {
        print("⚠️ DolphinHotPatch: Disconnected")
    }
}
