'use strict';

const { DolphinFramework } = require('../src/framework/DolphinFramework');

const app = DolphinFramework.createApp({
    name: 'Dolphin Form Lab',
    platform: 'HTML',
    debug: true,
});

// Initial State declarations
app.state('theme', 150);
app.state('mui_name', '');
app.state('mui_pass', '');
app.state('mui_phone', '');
app.state('bs_email', '');
app.state('bs_age', '25');
app.state('bs_notif', true);
app.state('agree_terms', false);
app.state('newsletter', false);
app.state('gender', 'gender_male');
app.state('gender_male', true);
app.state('gender_female', false);
app.state('payment_method', 'eSewa');
app.state('budget_slider', 150);

// Shared Premium TabBar Component
const SharedTabBar = (activeTab) => {
    return (
        <div className="flex flex-row items-center justify-around bg-gradient-horiz-indigo-153-purple-153 h-20 px-2 shadow-2xl border-t border-indigo-200">
            <div 
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl ${activeTab === 'Home' ? 'bg-white/20' : 'bg-transparent'}`}
                action="nav:Home"
            >
                <span className="text-white text-base">📝</span>
                <span className="text-white font-extrabold text-[10px] mt-1 tracking-wider">FORM LAB</span>
            </div>
            <div 
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl ${activeTab === 'Details' ? 'bg-white/20' : 'bg-transparent'}`}
                action="nav:Details"
            >
                <span className="text-white text-base">🔍</span>
                <span className="text-white font-extrabold text-[10px] mt-1 tracking-wider">PREVIEW</span>
            </div>
        </div>
    );
};

// HOME SCREEN: Form Inputs (MUI, Bootstrap, Flutter styles)
const buildHomeScreen = () => {
    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:theme">
            {/* Header / AppBar */}
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-10 pb-4 shadow-md w-full">
                <span className="text-white font-black text-lg">🧪 Dolphin Form Lab</span>
                <div className="flex-1" />
                <span className="text-white text-xs bg-white/20 px-3 py-1 rounded-full font-bold">ALL-IN-ONE</span>
            </div>

            {/* Form scrollable container */}
            <div type="ListView" className="flex-1 p-0">
                
                {/* 1. MUI Style - Outlined, Filled, and Standard Showcase */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">🏛️</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Material UI (MUI) Showcase</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Outlined, Filled, and Standard Inputs</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* A. MUI Outlined Input */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-black uppercase">Style A: Outlined Field</span>
                            <input 
                                type="text" 
                                variant="outlined" 
                                stateKey="mui_name" 
                                label="Outlined Name" 
                                placeholder="e.g. Biraj Phuyal" 
                                className="w-full"
                            />
                        </div>

                        {/* B. MUI Filled Input */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-black uppercase">Style B: Filled Field</span>
                            <input 
                                type="email" 
                                variant="filled" 
                                stateKey="bs_email" 
                                label="Filled Email" 
                                placeholder="e.g. biraj@dolphin.io" 
                                className="w-full"
                            />
                        </div>

                        {/* C. MUI Standard Input */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-black uppercase">Style C: Standard Clean Field</span>
                            <input 
                                type="phone" 
                                variant="standard" 
                                stateKey="mui_phone" 
                                label="Standard Phone Number" 
                                placeholder="e.g. 9841234567" 
                                className="w-full"
                            />
                        </div>

                        {/* D. MUI Outlined Password Field */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-black uppercase">Style D: Outlined Password</span>
                            <input 
                                type="password" 
                                variant="outlined" 
                                stateKey="mui_pass" 
                                label="Secure Password" 
                                placeholder="Enter secure password" 
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Bootstrap Style - Input Groups, Switches & Checkboxes */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">🥾</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Bootstrap Style Controls</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Form Groups, Switches &amp; Checkboxes</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Age Input (Numeric) */}
                        <input 
                            type="number" 
                            variant="outlined" 
                            stateKey="bs_age" 
                            label="Age (Years)" 
                            placeholder="25" 
                            className="w-full"
                        />

                        {/* Divider */}
                        <div className="h-px bg-slate-200 w-full" />

                        {/* Switch component (Notifications) */}
                        <div 
                            type="Switch" 
                            stateKey="bs_notif" 
                            label="Enable Push Notifications" 
                            className="w-full p-2" 
                        />

                        {/* Checkbox component (Terms) */}
                        <div 
                            type="Checkbox" 
                            stateKey="agree_terms" 
                            label="I accept all terms &amp; privacy policies" 
                            className="w-full p-2" 
                        />

                        {/* Checkbox component (Newsletter) */}
                        <div 
                            type="Checkbox" 
                            stateKey="newsletter" 
                            label="Subscribe to monthly tech newsletter" 
                            className="w-full p-2" 
                        />
                    </div>
                </div>

                {/* 3. Flutter Style - Selectors, Radios & Sliders */}
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">💙</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Flutter Style Widgets</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">Dropdown Select, Sliders &amp; Radios</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Radio Selection Group */}
                        <span className="text-slate-700 font-extrabold text-xs">Preferred Gender:</span>
                        <div className="flex flex-row items-center gap-6">
                            <div type="Radio" stateKey="gender_male" label="Male" className="flex-1" />
                            <div type="Radio" stateKey="gender_female" label="Female" className="flex-1" />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-200 w-full" />

                        {/* Dropdown Selector */}
                        <div 
                            type="Select" 
                            stateKey="payment_method" 
                            label="Choose Local Payment Method" 
                            options="eSewa,Khalti,Bank Transfer,ConnectIPS,IME Pay" 
                            value="eSewa" 
                            className="w-full" 
                        />

                        {/* Dynamic Slider */}
                        <div className="flex flex-col gap-2 w-full mt-2">
                            <span className="text-slate-700 font-extrabold text-xs">Custom Slider Value:</span>
                            <div 
                                type="Slider" 
                                stateKey="budget_slider" 
                                label="Budget (USD)" 
                                initial={150} 
                                className="w-full" 
                            />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-200 w-full" />

                        {/* Theme Controller slider */}
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-slate-700 font-extrabold text-xs">Dynamic UI Depth Theme:</span>
                            <input 
                                type="range" 
                                stateKey="theme" 
                                initial="150" 
                                min="10" 
                                max="245" 
                                className="w-full" 
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="flex flex-row gap-4 mx-4 mb-8">
                    <div 
                        className="flex-1 bg-red-500 py-4 px-6 rounded-2xl items-center justify-center shadow-md active:scale-95 transition-all" 
                        action="form:reset"
                    >
                        <span className="text-white font-extrabold text-sm">RESET FORM</span>
                    </div>
                    <div 
                        className="flex-1 bg-gradient-horiz-indigo-153-purple-153 py-4 px-6 rounded-2xl items-center justify-center shadow-md active:scale-95 transition-all" 
                        action="form:submit"
                    >
                        <span className="text-white font-extrabold text-sm">SUBMIT DATA</span>
                    </div>
                </div>

                <div className="h-24 w-full" />
            </div>

            {/* Bottom Navigation */}
            {SharedTabBar('Home')}
        </div>
    );
};

// DETAILS SCREEN: Live Preview Panel
const buildDetailsScreen = () => {
    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:theme">
            {/* Header */}
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-10 pb-4 shadow-md w-full">
                <div className="text-white text-xl font-bold px-2" action="nav:back">
                    &lt;
                </div>
                <div className="flex-1" />
                <span className="text-white font-black text-base">Real-time Form Preview</span>
                <div className="flex-1" />
            </div>

            <div type="ListView" className="flex-1 p-0">
                {/* Visual Glassmorphic Preview Card */}
                <div className="card bg-slate-stateKey:theme m-4 p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-3xl">📡</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-base">Live Preview Terminal</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">0ms Latency State Bindings</span>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full my-2" />

                    {/* MUI Fields */}
                    <div className="flex flex-col gap-2">
                        <span className="text-slate-400 text-[10px] uppercase font-black">Material Design Fields:</span>
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-row justify-between items-center">
                            <span className="text-slate-600 font-extrabold text-xs">Name:</span>
                            <span className="text-indigo-600 font-black text-xs">stateKey:mui_name|Anonymous</span>
                        </div>
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-row justify-between items-center">
                            <span className="text-slate-600 font-extrabold text-xs">Password Hash:</span>
                            <span className="text-indigo-600 font-black text-xs">stateKey:mui_pass|••••••••</span>
                        </div>
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-row justify-between items-center">
                            <span className="text-slate-600 font-extrabold text-xs">Phone:</span>
                            <span className="text-indigo-600 font-black text-xs">stateKey:mui_phone|-</span>
                        </div>
                    </div>

                    {/* Bootstrap Fields */}
                    <div className="flex flex-col gap-2 mt-2">
                        <span className="text-slate-400 text-[10px] uppercase font-black">Bootstrap Fields:</span>
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-row justify-between items-center">
                            <span className="text-slate-600 font-extrabold text-xs">Email:</span>
                            <span className="text-indigo-600 font-black text-xs">stateKey:bs_email|not provided</span>
                        </div>
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-row justify-between items-center">
                            <span className="text-slate-600 font-extrabold text-xs">Age:</span>
                            <span className="text-indigo-600 font-black text-xs">stateKey:bs_age|25</span>
                        </div>
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-row justify-between items-center">
                            <span className="text-slate-600 font-extrabold text-xs">Agreed Terms:</span>
                            <span className="text-indigo-600 font-black text-xs">stateKey:agree_terms|false</span>
                        </div>
                    </div>

                    {/* Flutter Fields */}
                    <div className="flex flex-col gap-2 mt-2">
                        <span className="text-slate-400 text-[10px] uppercase font-black">Flutter Widgets:</span>
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-row justify-between items-center">
                            <span className="text-slate-600 font-extrabold text-xs">Payment Method:</span>
                            <span className="text-indigo-600 font-black text-xs">stateKey:payment_method|eSewa</span>
                        </div>
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-row justify-between items-center">
                            <span className="text-slate-600 font-extrabold text-xs">Slider Limit:</span>
                            <span className="text-indigo-600 font-black text-xs">stateKey:budget_slider|150</span>
                        </div>
                    </div>
                </div>

                {/* Simulated Success Notification Card */}
                <div className="bg-emerald-50 border border-emerald-200 m-4 p-4 rounded-2xl flex flex-row items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div className="flex flex-col flex-1">
                        <span className="text-emerald-900 font-extrabold text-xs">Dynamic Cryptography Active</span>
                        <span className="text-emerald-700 text-[10px]">All offline states are securely encrypted in Android SQLite keystore.</span>
                    </div>
                </div>

                <div className="h-24 w-full" />
            </div>

            {SharedTabBar('Details')}
        </div>
    );
};

// Register screens
app.screen('Home', buildHomeScreen());
app.screen('Details', buildDetailsScreen());

app.entry('Home');

// ACTION HANDLERS
app.action('form:reset', async () => {
    // Reset all offline states
    app.state('mui_name', '');
    app.state('mui_pass', '');
    app.state('mui_phone', '');
    app.state('bs_email', '');
    app.state('bs_age', '25');
    app.state('bs_notif', true);
    app.state('agree_terms', false);
    app.state('newsletter', false);
    app.state('budget_slider', 150);
    
    // Alert user
    app.alert('फर्म खाली गरियो!', 'सबै इनपुट फिल्डहरू सफलताका साथ रिसेट भएका छन्।');
    
    app.screen('Home', buildHomeScreen());
    app.patchScreen('Home');
});

app.action('form:submit', async () => {
    const name = app.getState('mui_name') || 'Anonymous';
    const email = app.getState('bs_email') || 'Not Provided';
    const payment = app.getState('payment_method') || 'eSewa';
    const budget = app.getState('budget_slider') || 150;
    
    // Display premium Nepalese Alert dialog
    app.alert(
        'फिडब्याक प्राप्त भयो! ✅',
        `नमस्ते ${name},\nतपाईंको इमेल: ${email}\nभुक्तानी माध्यम: ${payment}\nबजेट: $${budget}\n\nसबै तथ्याङ्कहरू Dolphin Native State Engine बाट सफलताका साथ सिङ्क्रोनाइज भयो!`
    );
});

// Wildcard routing handler
app.action('nav:*', async (action) => {
    const rawPath = action.slice(4);
    const screenName = rawPath.split('?')[0];

    if (screenName === 'back') {
        app.navigate('Home');
        return;
    }
    app.navigate(screenName);
});

module.exports = app;
