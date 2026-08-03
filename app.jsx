'use strict';

const { DolphinFramework } = require('../src/framework/DolphinFramework');
const ub = require('../src/framework/ub.js');

const app = DolphinFramework.createApp({
    name: 'Dolphin Hardware Lab',
    platform: 'ANDROID',
    debug: true,
});

// Initial State declarations
app.state('theme', 150);
app.state('contacts_data', '📖 यहाँ सम्पर्कहरू देखा पर्नेछ। सम्पर्क लोड गर्नुहोस् थिच्नुहोस्।');
app.state('sms_phone', '');
app.state('sms_message', '');
app.state('phone_number', '');

// HTTP Intercom Signaling Hub States
app.state('intercom_server', 'http://192.168.1.6:5000');
app.state('intercom_device_id', 'ROOM_101');
app.state('intercom_target_id', 'NURSE_STATION_01');
app.state('intercom_status', 'Disconnected 🔴');
app.state('intercom_logs', '📟 HTTP Intercom Initialized.\nReady to connect...');


// Shared Premium TabBar Component
const SharedTabBar = (activeTab) => {
    return (
        <div className="flex flex-row items-center justify-around bg-gradient-horiz-indigo-153-purple-153 h-20 px-2 shadow-2xl border-t border-indigo-200">
            <div 
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl ${activeTab === 'Dashboard' ? 'bg-white/20' : 'bg-transparent'}`}
                action="nav:Dashboard"
            >
                <span className="text-white text-base">⚙️</span>
                <span className="text-white font-extrabold text-[10px] mt-1 tracking-wider">HARDWARE</span>
            </div>
            <div 
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl ${activeTab === 'Comm' ? 'bg-white/20' : 'bg-transparent'}`}
                action="nav:Comm"
            >
                <span className="text-white text-base">📡</span>
                <span className="text-white font-extrabold text-[10px] mt-1 tracking-wider">COMM HUB</span>
            </div>
            <div 
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl ${activeTab === 'UBTest' ? 'bg-white/20' : 'bg-transparent'}`}
                action="nav:UBTest"
            >
                <span className="text-white text-base">🧪</span>
                <span className="text-white font-extrabold text-[10px] mt-1 tracking-wider">UB TEST</span>
            </div>
        </div>
    );
};

// DASHBOARD SCREEN: General Hardware Operations
const buildDashboardScreen = () => {
    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:theme">
            {/* Header / AppBar */}
            <div className="flex flex-col items-center justify-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-10 pb-4 shadow-md w-full">
                <span className="text-white font-black text-lg text-center">⚙️ Core Hardware Dashboard</span>
                <span className="text-white text-[10px] bg-white/20 px-3 py-0.5 rounded-full font-bold mt-1">ACTIVE</span>
            </div>

            {/* Scrollable list */}
            <div type="ListView" className="flex-1 p-0">
                {/* 1. Quick Stats Card */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">System Diagnostics</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Live Status Monitor</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-row gap-4">
                        <div 
                            className="flex-1 bg-gradient-horiz-indigo-153-purple-153 py-3 px-4 rounded-xl items-center justify-center active:scale-95 transition-all shadow-sm"
                            action="hw:log:status"
                        >
                            <span className="text-white font-bold text-xs">DIAGNOSTIC STATUS</span>
                        </div>
                    </div>
                </div>

                {/* 2. Audio & Media controls */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">🎵</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Media &amp; Acoustics</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">System Tones, Audio &amp; Microphone</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-3">
                            <div 
                                className="flex-1 bg-white/10 border border-slate-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:ringtone:play"
                            >
                                <span className="text-slate-700 font-extrabold text-xs">PLAY TONE</span>
                            </div>
                            <div 
                                className="flex-1 bg-white/10 border border-slate-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:ringtone:stop"
                            >
                                <span className="text-slate-700 font-extrabold text-xs">STOP TONE</span>
                            </div>
                        </div>

                        <div 
                            className="w-full bg-indigo-50 border border-indigo-200 py-3 px-4 rounded-xl items-center justify-center active:scale-95 transition-all"
                            action="hw:dialtone"
                        >
                            <span className="text-indigo-700 font-extrabold text-xs">PLAY DTMF DIALTONE</span>
                        </div>

                        <div className="h-px bg-slate-200 w-full my-1" />

                        <div className="flex flex-row gap-3">
                            <div 
                                className="flex-1 bg-emerald-50 border border-emerald-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:mic:start"
                            >
                                <span className="text-emerald-700 font-extrabold text-xs">🎙️ REC MIC</span>
                            </div>
                            <div 
                                className="flex-1 bg-red-50 border border-red-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:mic:stop"
                            >
                                <span className="text-red-700 font-extrabold text-xs">🛑 STOP REC</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Peripherals & Utilities */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">🔦</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Peripherals &amp; Utilities</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Camera Flashlight &amp; Haptic Feedbacks</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-3">
                            <div 
                                className="flex-1 bg-amber-50 border border-amber-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:flashlight:on"
                            >
                                <span className="text-amber-800 font-extrabold text-xs">💡 FLASH ON</span>
                            </div>
                            <div 
                                className="flex-1 bg-slate-100 border border-slate-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:flashlight:off"
                            >
                                <span className="text-slate-700 font-extrabold text-xs">💡 FLASH OFF</span>
                            </div>
                        </div>

                        <div 
                            className="w-full bg-purple-50 border border-purple-200 py-3 px-4 rounded-xl items-center justify-center active:scale-95 transition-all"
                            action="hw:camera:open"
                        >
                            <span className="text-purple-700 font-extrabold text-xs">📷 SYSTEM CAMERA OPEN</span>
                        </div>

                        <div className="h-px bg-slate-200 w-full my-1" />

                        <span className="text-slate-700 font-extrabold text-xs">Haptic Vibration Test:</span>
                        <div className="flex flex-row gap-2">
                            <div 
                                className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:haptic:light"
                            >
                                <span className="text-slate-600 font-bold text-xs">LIGHT</span>
                            </div>
                            <div 
                                className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:haptic:medium"
                            >
                                <span className="text-slate-600 font-bold text-xs">MEDIUM</span>
                            </div>
                            <div 
                                className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:haptic:heavy"
                            >
                                <span className="text-slate-600 font-bold text-xs">HEAVY</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Depth Slider */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <span className="text-slate-700 font-extrabold text-xs">UI Depth Config:</span>
                    <input 
                        type="range" 
                        stateKey="theme" 
                        initial="150" 
                        min="10" 
                        max="245" 
                        className="w-full" 
                    />
                </div>

                <div className="h-24 w-full" />
            </div>

            {/* Tab Bar */}
            {SharedTabBar('Dashboard')}
        </div>
    );
};

// COMM HUB SCREEN: Contacts, phone call dial, and SMS
const buildCommScreen = () => {
    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:theme">
            {/* Header / AppBar */}
            <div className="flex flex-col items-center justify-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-10 pb-4 shadow-md w-full">
                <span className="text-white font-black text-lg text-center">📡 Communication Hub</span>
                <span className="text-white text-[10px] bg-white/20 px-3 py-0.5 rounded-full font-bold mt-1">CONNECTED</span>
            </div>

            {/* Scrollable list */}
            <div type="ListView" className="flex-1 p-0">
                {/* 1. Phone Dial Section */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">📞</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Phone Dialer Service</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Launch System Dialer</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <input 
                            type="phone" 
                            variant="outlined" 
                            stateKey="phone_number" 
                            label="फोन नम्बर (Phone Number)" 
                            placeholder="डायल नम्बर लेख्नुहोस् (e.g. 9841XXXXXX)" 
                            className="w-full"
                        />
                        <div 
                            className="w-full bg-indigo-50 border border-indigo-200 py-3.5 px-4 rounded-xl items-center justify-center active:scale-95 transition-all"
                            action="hw:phone:dial"
                        >
                            <span className="text-indigo-700 font-extrabold text-sm">डायल गर्नुहोस् (DIAL NUMBER)</span>
                        </div>
                    </div>
                </div>

                {/* 2. SMS Dispatch Section */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">💬</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">SMS Messenger</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Send System SMS</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <input 
                            type="phone" 
                            variant="outlined" 
                            stateKey="sms_phone" 
                            label="प्रापकको फोन नम्बर (Recipient Phone)" 
                            placeholder="सम्पर्क नम्बर (e.g. 9841XXXXXX)" 
                            className="w-full"
                        />
                        <input 
                            type="text" 
                            variant="outlined" 
                            stateKey="sms_message" 
                            label="सन्देश (SMS Body)" 
                            placeholder="सन्देश टाइप गर्नुहोस्..." 
                            className="w-full"
                        />
                        <div 
                            className="w-full bg-emerald-50 border border-emerald-200 py-3.5 px-4 rounded-xl items-center justify-center active:scale-95 transition-all"
                            action="hw:sms:send"
                        >
                            <span className="text-emerald-700 font-extrabold text-sm">सन्देश पठाउनुहोस् (SEND SMS)</span>
                        </div>
                    </div>
                </div>

                {/* 3. Contacts Showcase Section */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">📖</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Address Book &amp; Contacts</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Fetch Device Contacts List</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div 
                            className="w-full bg-amber-50 border border-amber-200 py-3.5 px-4 rounded-xl items-center justify-center active:scale-95 transition-all"
                            action="hw:contacts:get"
                        >
                            <span className="text-amber-800 font-extrabold text-sm">📖 सम्पर्कहरू लोड गर्नुहोस् (LOAD CONTACTS)</span>
                        </div>

                        <div className="h-px bg-slate-200 w-full" />

                        {/* Contacts Data Display Terminal */}
                        <div className="flex flex-col gap-1.5 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                            <span className="text-slate-500 font-black text-[9px] uppercase tracking-wider">Contacts Terminal Output:</span>
                            <span className="text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">stateKey:contacts_data|📖 यहाँ सम्पर्कहरू देखा पर्नेछ। सम्पर्क लोड गर्नुहोस् थिच्नुहोस्।</span>
                        </div>
                    </div>
                </div>

                {/* 4. HTTP Intercom Signaling Hub Section */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">📟</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">HTTP Intercom Signaling Hub</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Dolphin Server Modules Integration</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <input 
                            type="text" 
                            variant="outlined" 
                            stateKey="intercom_server" 
                            label="इन्टरकम सर्भर (Server URL)" 
                            placeholder="e.g. http://192.168.1.6:5000" 
                            className="w-full"
                        />
                        
                        <div className="flex flex-row gap-3">
                            <input 
                                type="text" 
                                variant="outlined" 
                                stateKey="intercom_device_id" 
                                label="मेरो डिभाइस (My ID)" 
                                placeholder="e.g. ROOM_101" 
                                className="flex-1"
                            />
                            <div 
                                className="bg-indigo-50 border border-indigo-200 py-3.5 px-3 rounded-xl items-center justify-center active:scale-95 transition-all flex-[0.7]"
                                action="intercom:register"
                            >
                                <span className="text-indigo-700 font-extrabold text-xs">रजिस्टर (REGISTER)</span>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 w-full my-1" />

                        <input 
                            type="text" 
                            variant="outlined" 
                            stateKey="intercom_target_id" 
                            label="कल गर्ने डिभाइस (Target ID)" 
                            placeholder="e.g. NURSE_STATION_01" 
                            className="w-full"
                        />

                        <div className="flex flex-row gap-3">
                            <div 
                                className="flex-1 bg-emerald-50 border border-emerald-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="intercom:invite"
                            >
                                <span className="text-emerald-700 font-extrabold text-xs">📞 कल (CALL)</span>
                            </div>
                            <div 
                                className="flex-1 bg-amber-50 border border-amber-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:intercom:accept"
                            >
                                <span className="text-amber-800 font-extrabold text-xs">✅ उठाउने (ACCEPT)</span>
                            </div>
                            <div 
                                className="flex-1 bg-red-50 border border-red-200 py-3 px-2 rounded-xl items-center justify-center active:scale-95 transition-all"
                                action="hw:intercom:end"
                            >
                                <span className="text-red-700 font-extrabold text-xs">🛑 काट्ने (HANGUP)</span>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 w-full" />

                        {/* Intercom Terminal Output */}
                        <div className="flex flex-col gap-1.5 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                            <div className="flex flex-row justify-between items-center">
                                <span className="text-slate-500 font-black text-[9px] uppercase tracking-wider">Intercom Console Output:</span>
                                <span className="text-emerald-500 font-extrabold text-[9px] uppercase">stateKey:intercom_status|Disconnected 🔴</span>
                            </div>
                            <span className="text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">stateKey:intercom_logs|📟 HTTP Intercom Ready...</span>
                        </div>
                    </div>
                </div>

                <div className="h-24 w-full" />
            </div>

            {/* Tab Bar */}
            {SharedTabBar('Comm')}
        </div>
    );
};

const buildUBTestScreen = () => {
    // Get debug info
    const dbg = ub.debugUB();
    
    return (
        <div className="flex flex-col flex-1" gradient="gradient-vert-indigo-60-purple-200">
            {/* Header — glass AppBar */}
            <div className="flex flex-col items-center justify-center px-4 pt-10 pb-5 w-full" className="glass-vert-indigo-80-blue-120-60-blur-20">
                <span className="text-white font-black text-lg text-center">🧪 UB Test &amp; Diagnostics Lab</span>
                <span className="text-white text-[10px] bg-white/20 px-3 py-0.5 rounded-full font-bold mt-1">v19.0.3 STABLE</span>
            </div>

            {/* Scrollable list */}
            <div type="ListView" className="flex-1 p-0">

                {/* 1. Debug stats — glass card */}
                <div className="m-4 p-5 rounded-3xl flex flex-col gap-3" className="glass-vert-blue-80-indigo-120-50">
                    <span className="text-white font-extrabold text-sm">📊 WebStyleEngine debugUB() stats</span>
                    <div className="flex flex-col gap-1.5 rounded-2xl p-4" className="glass-indigo-200-blue-220-30-blur-8">
                        <span className="text-white/60 font-black text-[9px] uppercase tracking-wider">Debug Output:</span>
                        <span className="text-emerald-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                            {`Version: ${dbg.version || 'v19.0.3'}\nCache Size: ${dbg.classCache || 0}\nStyle Count: ${dbg.styleCount || 0}\nRequests: ${dbg.totalRequests || 0}\nHits: ${dbg.cacheHits || 0}`}
                        </span>
                    </div>
                </div>

                {/* 2. Button variants — glass card */}
                <div className="m-4 p-5 rounded-3xl flex flex-col gap-4" className="glass-vert-purple-80-pink-120-50">
                    <span className="text-white font-extrabold text-sm">🔘 Button Variants</span>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-3">
                            <div className="btn btn-primary flex-1 py-3 items-center justify-center rounded-xl"><span className="text-white text-xs font-bold">PRIMARY</span></div>
                            <div className="btn btn-secondary flex-1 py-3 items-center justify-center rounded-xl"><span className="text-white text-xs font-bold">SECONDARY</span></div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="btn btn-success flex-1 py-3 items-center justify-center rounded-xl"><span className="text-white text-xs font-bold">SUCCESS</span></div>
                            <div className="btn btn-danger flex-1 py-3 items-center justify-center rounded-xl"><span className="text-white text-xs font-bold">DANGER</span></div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="btn btn-warning flex-1 py-3 items-center justify-center rounded-xl"><span className="text-white text-xs font-bold">WARNING</span></div>
                            <div className="btn btn-glow btn-primary flex-1 py-3 items-center justify-center rounded-xl"><span className="text-white text-xs font-bold">✨ GLOW</span></div>
                        </div>
                    </div>
                </div>

                {/* 3. Gradient showcase — glass card */}
                <div className="m-4 p-5 rounded-3xl flex flex-col gap-4" className="glass-vert-cyan-80-teal-120-50">
                    <span className="text-white font-extrabold text-sm">🌈 OKLCH Gradients Test</span>
                    <div className="flex flex-col gap-3">
                        <div className="p-4 rounded-2xl flex flex-col" gradient="gradient-blue-100-purple-200">
                            <span className="text-white font-extrabold text-xs">DIAGONAL 135°</span>
                            <span className="text-white/70 text-[9px]">gradient-blue-100-purple-200</span>
                        </div>
                        <div className="p-4 rounded-2xl flex flex-col" gradient="gradient-vert-indigo-80-pink-220">
                            <span className="text-white font-extrabold text-xs">VERTICAL ↓</span>
                            <span className="text-white/70 text-[9px]">gradient-vert-indigo-80-pink-220</span>
                        </div>
                        <div className="p-4 rounded-2xl flex flex-col" gradient="gradient-horiz-cyan-100-teal-200">
                            <span className="text-white font-extrabold text-xs">HORIZONTAL →</span>
                            <span className="text-white/70 text-[9px]">gradient-horiz-cyan-100-teal-200</span>
                        </div>
                        <div className="p-4 rounded-2xl flex flex-col" gradient="gradient-radial-orange-80-red-200">
                            <span className="text-white font-extrabold text-xs">RADIAL ○</span>
                            <span className="text-white/70 text-[9px]">gradient-radial-orange-80-red-200</span>
                        </div>
                        <div className="p-4 rounded-2xl flex flex-col" gradient="gradient-45deg-amber-80-orange-200">
                            <span className="text-white font-extrabold text-xs">45DEG ANGLE ↗</span>
                            <span className="text-white/70 text-[9px]">gradient-45deg-amber-80-orange-200</span>
                        </div>
                        <div className="p-4 rounded-2xl flex flex-col" gradient="gradient-red-80-purple-140-blue-220">
                            <span className="text-white font-extrabold text-xs">TRIPLE GRADIENT 🌈</span>
                            <span className="text-white/70 text-[9px]">gradient-red-80-purple-140-blue-220</span>
                        </div>
                    </div>
                </div>

                {/* 4. Color swatches — glass card */}
                <div className="m-4 p-5 rounded-3xl flex flex-col gap-4" className="glass-vert-pink-80-orange-120-50">
                    <span className="text-white font-extrabold text-sm">🎨 Color shades swatch</span>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-1">
                            <div className="flex-1 h-8 bg-red-50 rounded" />
                            <div className="flex-1 h-8 bg-red-100 rounded" />
                            <div className="flex-1 h-8 bg-red-128 rounded" />
                            <div className="flex-1 h-8 bg-red-180 rounded" />
                            <div className="flex-1 h-8 bg-red-220 rounded" />
                            <span className="text-white/70 text-[10px] uppercase font-bold self-center ml-1">red</span>
                        </div>
                        <div className="flex-row gap-1">
                            <div className="flex-1 h-8 bg-blue-50 rounded" />
                            <div className="flex-1 h-8 bg-blue-100 rounded" />
                            <div className="flex-1 h-8 bg-blue-128 rounded" />
                            <div className="flex-1 h-8 bg-blue-180 rounded" />
                            <div className="flex-1 h-8 bg-blue-220 rounded" />
                            <span className="text-white/70 text-[10px] uppercase font-bold self-center ml-1">blue</span>
                        </div>
                        <div className="flex-row gap-1">
                            <div className="flex-1 h-8 bg-green-50 rounded" />
                            <div className="flex-1 h-8 bg-green-100 rounded" />
                            <div className="flex-1 h-8 bg-green-128 rounded" />
                            <div className="flex-1 h-8 bg-green-180 rounded" />
                            <div className="flex-1 h-8 bg-green-220 rounded" />
                            <span className="text-white/70 text-[10px] uppercase font-bold self-center ml-1">green</span>
                        </div>
                        <div className="flex-row gap-1">
                            <div className="flex-1 h-8 bg-purple-50 rounded" />
                            <div className="flex-1 h-8 bg-purple-100 rounded" />
                            <div className="flex-1 h-8 bg-purple-128 rounded" />
                            <div className="flex-1 h-8 bg-purple-180 rounded" />
                            <div className="flex-1 h-8 bg-purple-220 rounded" />
                            <span className="text-white/70 text-[10px] uppercase font-bold self-center ml-1">purple</span>
                        </div>
                        <div className="flex-row gap-1">
                            <div className="flex-1 h-8 bg-orange-50 rounded" />
                            <div className="flex-1 h-8 bg-orange-100 rounded" />
                            <div className="flex-1 h-8 bg-orange-128 rounded" />
                            <div className="flex-1 h-8 bg-orange-180 rounded" />
                            <div className="flex-1 h-8 bg-orange-220 rounded" />
                            <span className="text-white/70 text-[10px] uppercase font-bold self-center ml-1">orange</span>
                        </div>
                    </div>
                </div>

                {/* 5. Glass patterns showcase */}
                <div className="m-4 p-5 rounded-3xl flex flex-col gap-4" className="glass-vert-teal-80-cyan-120-50">
                    <span className="text-white font-extrabold text-sm">🪟 Glass Patterns Showcase</span>
                    <div className="flex flex-col gap-3">
                        <div className="p-4 rounded-2xl flex flex-col gap-1" className="glass-vert-blue-80-indigo-140-70-blur-16">
                            <span className="text-white font-bold text-xs">glass-vert-blue-80-indigo-140-70</span>
                            <span className="text-white/60 text-[9px]">Vertical • blur-16 • opacity 70/255</span>
                        </div>
                        <div className="p-4 rounded-2xl flex flex-col gap-1" className="glass-horiz-pink-80-purple-140-70-blur-20">
                            <span className="text-white font-bold text-xs">glass-horiz-pink-80-purple-140-70</span>
                            <span className="text-white/60 text-[9px]">Horizontal • blur-20 • opacity 70/255</span>
                        </div>
                        <div className="p-4 rounded-2xl flex flex-col gap-1" className="glass-radial-cyan-80-teal-140-70-blur-24">
                            <span className="text-white font-bold text-xs">glass-radial-cyan-80-teal-140-70</span>
                            <span className="text-white/60 text-[9px]">Radial • blur-24 • opacity 70/255</span>
                        </div>
                        <div className="p-4 rounded-2xl flex flex-col gap-1" className="glass-amber-80-orange-140-80-blur-12">
                            <span className="text-white font-bold text-xs">glass-amber-80-orange-140-80</span>
                            <span className="text-white/60 text-[9px]">Diagonal 135° • blur-12 • opacity 80/255</span>
                        </div>
                    </div>
                </div>

                <div className="h-24 w-full" />
            </div>

            {/* Tab Bar */}
            {SharedTabBar('UBTest')}
        </div>
    );
};


// Register screens
app.screen('Dashboard', buildDashboardScreen());
app.screen('Comm', buildCommScreen());
app.screen('UBTest', buildUBTestScreen());

app.entry('UBTest');

// Wildcard routing handler
app.action('nav:*', async (action) => {
    const rawPath = action.slice(4);
    const screenName = rawPath.split('?')[0];
    app.navigate(screenName);
});

// HTTP Intercom Signaling Actions
app.action('intercom:register', async () => {
    const server = app.state('intercom_server') || 'http://192.168.1.6:5000';
    const deviceId = app.state('intercom_device_id') || 'ROOM_101';
    
    app.state('intercom_logs', `⏳ Registering "${deviceId}" on ${server}...`);
    
    try {
        const response = await fetch(`${server}/api/intercom/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId })
        });
        const data = await response.json();
        if (data.success) {
            app.state('intercom_status', 'Registered 🟢');
            app.state('intercom_logs', `✅ Registered device: ${deviceId}\nIntercom signaling bus is active.`);
        } else {
            app.state('intercom_status', 'Error 🔴');
            app.state('intercom_logs', `❌ Server registration failed: ${data.error || 'Unknown error'}`);
        }
    } catch (e) {
        app.state('intercom_status', 'Error 🔴');
        app.state('intercom_logs', `❌ Connection Error:\n${e.message}\nMake sure dolphin-server is running on port 5000.`);
    }
});

app.action('intercom:invite', async () => {
    const server = app.state('intercom_server') || 'http://192.168.1.6:5000';
    const from = app.state('intercom_device_id') || 'ROOM_101';
    const to = app.state('intercom_target_id') || 'NURSE_STATION_01';
    
    app.state('intercom_logs', `📞 Placing intercom call to "${to}"...`);
    app.state('intercom_status', 'Ringing 🟡');
    
    try {
        const response = await fetch(`${server}/api/intercom/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to, message: 'Emergency Intercom Call' })
        });
        const data = await response.json();
        if (data.success) {
            app.state('intercom_logs', `🔊 Ringing target "${to}"...\nStatus: ${data.status}`);
        } else {
            app.state('intercom_status', 'Failed 🔴');
            app.state('intercom_logs', `❌ Call failed: Target "${to}" might be offline.`);
        }
    } catch (e) {
        app.state('intercom_status', 'Error 🔴');
        app.state('intercom_logs', `❌ Connection Error:\n${e.message}`);
    }
});

// NOTE: intercom:accept is now handled NATIVELY on Android via hw:intercom:accept button.
// This server-side handler is kept as a fallback for web/simulator testing only.
app.action('intercom:accept', async () => {
    const server = app.state('intercom_server') || 'http://192.168.1.6:5000';
    const from = app.state('intercom_device_id') || 'ROOM_101';
    const to = app.state('intercom_target_id') || 'NURSE_STATION_01';
    
    app.state('intercom_logs', `⏳ Accepting call from "${to}"...`);
    
    try {
        const response = await fetch(`${server}/api/intercom/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to })
        });
        const data = await response.json();
        if (data.success) {
            app.state('intercom_status', 'Connected 🟢');
            app.state('intercom_logs', `📞 Signal sent to "${to}".\n(On Android: use hw:intercom:accept button to start audio)`);
        } else {
            app.state('intercom_status', 'Failed 🔴');
            app.state('intercom_logs', `❌ Failed to accept call.`);
        }
    } catch (e) {
        app.state('intercom_status', 'Error 🔴');
        app.state('intercom_logs', `❌ Connection Error:\n${e.message}`);
    }
});

// NOTE: intercom:end is now handled NATIVELY on Android via hw:intercom:end button.
// This server-side handler is kept as a fallback for web/simulator testing only.
app.action('intercom:end', async () => {
    const server = app.state('intercom_server') || 'http://192.168.1.6:5000';
    const from = app.state('intercom_device_id') || 'ROOM_101';
    const to = app.state('intercom_target_id') || 'NURSE_STATION_01';
    
    app.state('intercom_logs', `🛑 Hanging up call...`);
    
    try {
        const response = await fetch(`${server}/api/intercom/end`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to, reason: 'User hung up' })
        });
        app.state('intercom_status', 'Disconnected 🔴');
        app.state('intercom_logs', `🛑 Call ended.`);
    } catch (e) {
        app.state('intercom_status', 'Disconnected 🔴');
        app.state('intercom_logs', `🛑 Call disconnected.`);
    }
});

module.exports = app;
