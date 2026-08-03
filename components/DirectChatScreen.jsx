'use strict';

const Dolphin = require('dolphin-native');
const { Image } = Dolphin;
const { WsIndicator } = require('../components/WsIndicator');

const DirectChatScreen = () => {
    const messages = Dolphin.getState('current_messages') || [];
    const partnerName = Dolphin.getState('chat_partner_name') || 'Chat';
    const partnerExt = Dolphin.getState('chat_partner_ext') || '';
    const userId = Dolphin.getState('user_id') || '';
    const downloadsDir = Dolphin.getState('downloads_dir') || '/storage/emulated/0/Download';

    return (
        <div title="Direct Chat" type="Screen" id="DirectChatScreen" 
             className="flex-column bg-slate-100 h-full w-full justify-between framer-spring">
            
            {/* Header - Teal/Emerald Theme */}
            <div className="flex-row justify-between items-center bg-teal-600 p-4 shadow-md z-10">
                <div className="flex-row items-center gap-3">
                    <div className="items-center justify-center p-2 rounded-full active:bg-teal-700" 
                         action="nav:ChatListScreen">
                        <span className="text-white text-lg font-bold">◀</span>
                    </div>
                    <div className="flex-column">
                        <span className="text-base font-bold text-white">{partnerName}</span>
                        <span className="text-xs text-teal-100">Ext: {partnerExt}</span>
                    </div>
                    <WsIndicator />
                </div>
                
                {/* Fixed: Call icons with proper size and alignment */}
                <div className="flex-row gap-2">
                    <div className="w-11 h-11 rounded-full bg-white items-center justify-center active:bg-teal-50 shadow-sm" 
                         action={`app:start_call:${partnerExt}`}>
                        <span className="text-xl">📞</span>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-white items-center justify-center active:bg-teal-50 shadow-sm" 
                         action={`app:start_video_call:${partnerExt}`}>
                        <span className="text-xl">📹</span>
                    </div>
                </div>
            </div>

            {/* Message Area - Changed to ListView for proper scrolling */}
            <div type="ListView" className="flex-1 p-4 flex-column gap-3">
                {messages.length === 0 ? (
                    <div className="flex-1 justify-center items-center">
                        <span className="text-xs text-slate-500">No messages yet. Send a message to start!</span>
                    </div>
                ) : (
                    <div className="flex-column gap-2">
                        {messages.map(msg => {
                            const isMe = msg.senderId === userId;
                            const isFile = msg.type === 'file';
                            let fileInfo = null;
                            
                            if (isFile) {
                                try {
                                    fileInfo = typeof msg.content === 'string' 
                                        ? JSON.parse(msg.content) 
                                        : msg.content;
                                } catch (e) {
                                    fileInfo = { 
                                        fileName: msg.mediaName || 'File', 
                                        fileSize: msg.mediaSize || 0 
                                    };
                                }
                            }

                            // Format file size
                            const formatBytes = (bytes) => {
                                if (!bytes) return '0 B';
                                const k = 1024;
                                const sizes = ['B', 'KB', 'MB', 'GB'];
                                const i = Math.floor(Math.log(bytes) / Math.log(k));
                                return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
                            };

                            // Get P2P transfer progress/state
                            const transfer = Dolphin.getState(`p2p_transfer_${msg.id}`) || { 
                                status: 'idle', 
                                progress: 0 
                            };

                            // Determine image preview path
                            let imagePreviewPath = '';
                            if (isFile && fileInfo) {
                                const name = fileInfo.fileName || '';
                                const ext = name.split('.').pop().toLowerCase();
                                const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
                                
                                if (isImg) {
                                    const rawPath = isMe 
                                        ? (fileInfo.filePath || (global.p2pFilesMap && global.p2pFilesMap[msg.id]))
                                        : (transfer.status === 'completed' 
                                            ? (downloadsDir + '/' + name) 
                                            : null);
                                    
                                    if (rawPath) {
                                        imagePreviewPath = "file://" + rawPath;
                                    }
                                }
                            }

                            const downloadLabel = transfer.status === 'fallback_ws' 
                                ? 'Downloading via Server' 
                                : 'Downloading';
                            const downloadError = transfer.error || 'File error';

                            return (
                                <div key={msg.id} className={`flex-column max-w-xs p-3 shadow-lg rounded-2xl ${
                                    isMe 
                                        ? 'bg-gradient-horiz-teal-500-emerald-500 text-white align-self-end' 
                                        : 'bg-white text-slate-900 border border-slate-200 align-self-start'
                                }`}>
                                    {isFile && fileInfo ? (
                                        <div className="flex-column gap-2 min-w-48">
                                            {imagePreviewPath ? (
                                                <Image 
                                                    src={imagePreviewPath}
                                                    className="w-full h-32 rounded-lg object-cover mb-1"
                                                />
                                            ) : null}
                                            
                                            <div className="flex-row items-center gap-2">
                                                <span className="text-2xl">📄</span>
                                                <div className="flex-column flex-1 truncate">
                                                    <span className={`text-sm font-semibold truncate ${
                                                        isMe ? 'text-white' : 'text-slate-900'
                                                    }`}>
                                                        {fileInfo.fileName}
                                                    </span>
                                                    <span className={`text-xxs ${
                                                        isMe ? 'text-teal-100' : 'text-slate-500'
                                                    }`}>
                                                        {formatBytes(fileInfo.fileSize)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Transfer Status & Actions */}
                                            {isMe ? (
                                                <div className="flex-column gap-1 bg-teal-700 rounded-lg p-2 mt-1">
                                                    {transfer.status === 'idle' || transfer.status === 'waiting' ? (
                                                        <span className="text-xxs text-teal-100">
                                                            Waiting for receiver...
                                                        </span>
                                                    ) : transfer.status === 'transferring' ? (
                                                        <div className="flex-column gap-1">
                                                            {/* Fixed: Text above progress bar with proper contrast */}
                                                            <div className="flex-row justify-between items-center">
                                                                <span className="text-xxs text-white font-medium">Sending</span>
                                                                <span className="text-xxs text-white font-bold">{transfer.progress}%</span>
                                                            </div>
                                                            <div className="w-full bg-teal-900 rounded-full h-1.5 overflow-hidden">
                                                                <div className="bg-white h-full rounded-full" 
                                                                     style={{ width: `${transfer.progress}%` }}>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : transfer.status === 'completed' ? (
                                                        <span className="text-xxs text-emerald-200 font-bold">
                                                            ✓ Sent successfully
                                                        </span>
                                                    ) : (
                                                        <span className="text-xxs text-teal-100">LAN Server Active</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex-column gap-1 mt-1">
                                                    {transfer.status === 'idle' || transfer.status === 'waiting' ? (
                                                        <div className="bg-teal-600 text-white text-xs font-semibold rounded-lg py-1.5 px-3 items-center justify-center active:scale-95 transition-all"
                                                             action={`app:accept_file_offer:${msg.id}`}>
                                                            <span>Download File</span>
                                                        </div>
                                                    ) : transfer.status === 'connecting_lan' ? (
                                                        <span className="text-xxs text-teal-700 bg-teal-50 rounded-lg p-2 border border-teal-200">
                                                            Connecting LAN...
                                                        </span>
                                                    ) : transfer.status === 'connecting_webrtc' ? (
                                                        <span className="text-xxs text-teal-700 bg-teal-50 rounded-lg p-2 border border-teal-200">
                                                            Connecting Remote P2P...
                                                        </span>
                                                    ) : (transfer.status === 'transferring' || transfer.status === 'fallback_ws') ? (
                                                        <div className="flex-column gap-1 bg-teal-50 rounded-lg p-2 border border-teal-200">
                                                            {/* Fixed: Text above progress bar with proper contrast */}
                                                            <div className="flex-row justify-between items-center">
                                                                <span className="text-xxs text-teal-900 font-medium">
                                                                    {downloadLabel}
                                                                </span>
                                                                <span className="text-xxs text-teal-900 font-bold">
                                                                    {transfer.progress}%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-teal-200 rounded-full h-1.5 overflow-hidden">
                                                                <div className="bg-teal-600 h-full rounded-full" 
                                                                     style={{ width: `${transfer.progress}%` }}>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : transfer.status === 'completed' ? (
                                                        <span className="text-xxs text-emerald-800 font-bold bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                                                            ✓ Saved to Downloads
                                                        </span>
                                                    ) : transfer.status === 'failed' ? (
                                                        <span className="text-xxs text-red-800 font-bold bg-red-50 rounded-lg p-2 border border-red-200">
                                                            ✗ Download Failed ({downloadError})
                                                        </span>
                                                    ) : (
                                                        <span className="text-xxs text-teal-700 bg-teal-50 rounded-lg p-2 border border-teal-200">
                                                            Ready to download
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className={`text-sm ${isMe ? 'text-white' : 'text-slate-900'}`}>
                                            {msg.content}
                                        </span>
                                    )}
                                    
                                    {/* Message timestamp with checkmarks */}
                                    <span className={`text-xxs mt-1 align-self-end ${
                                        isMe ? 'text-teal-100' : 'text-slate-500'
                                    }`}>
                                        {msg.createdAt 
                                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit', 
                                                minute:'2-digit'
                                            }) 
                                            : ''
                                        }
                                        {isMe ? ' ✓✓' : ''}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Input Bar - Teal theme */}
            <div className="bg-white p-3 border-t border-slate-200 flex-row gap-2 items-center shadow-lg">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 items-center justify-center active:bg-slate-200" 
                     action="app:fm_open">
                    <span className="text-xl">📁</span>
                </div>
                
                <input 
                    type="text" 
                    stateKey="chat_input_text" 
                    placeholder="Type a message..." 
                    className="flex-1 p-3 bg-slate-50 text-slate-900 rounded-full border border-slate-200 text-sm px-4"
                />
                
                <div className="w-12 h-12 rounded-full bg-teal-600 items-center justify-center active:bg-teal-700 shadow-md" 
                     action="app:send_direct_message">
                    <span className="text-white text-lg font-bold">➔</span>
                </div>
            </div>
        </div>
    );
};

module.exports = { DirectChatScreen };
