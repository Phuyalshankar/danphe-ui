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

// Bootstrap Form States
app.state('bs_name', '');
app.state('bs_new_pass', '');
app.state('bs_dob', '');
app.state('bs_gender_m', true);
app.state('bs_gender_f', false);
app.state('bs_country', 'Nepal');
app.state('bs_range', 50);

// Shared Premium TabBar Component
const SharedTabBar = (activeTab) => {
    return (
        <div className="flex flex-row items-center justify-around bg-gradient-horiz-indigo-153-purple-153 h-15 px-2 shadow-2xl border-t border-indigo-200">
            <div
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl ${activeTab === 'Home' ? 'bg-white/20' : 'bg-transparent'}`}
                action="nav:Home"
            >
                <span className="text-white text-base">📝</span>
                <span className="text-white font-extrabold text-[9px] mt-0.5 tracking-wider">FORM LAB</span>
            </div>
            <div
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl ${activeTab === 'Bootstrap' ? 'bg-white/20' : 'bg-transparent'}`}
                action="nav:Bootstrap"
            >
                <span className="text-white text-base">🥾</span>
                <span className="text-white font-extrabold text-[9px] mt-0.5 tracking-wider">BOOTSTRAP</span>
            </div>
            <div
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl ${activeTab === 'Details' ? 'bg-white/20' : 'bg-transparent'}`}
                action="nav:Details"
            >
                <span className="text-white text-base">🔍</span>
                <span className="text-white font-extrabold text-[9px] mt-0.5 tracking-wider">PREVIEW</span>
            </div>
        </div>
    );
};

// 🚨 Beautiful, Premium, Theme-Adaptive Inline Alert Component
const Alert = ({ type = 'info', title, message, action, className = '' }) => {
    const alertColors = {
        success: {
            bg: 'bg-emerald-50/90 border-emerald-200',
            text: 'text-emerald-900',
            subtext: 'text-emerald-700',
            icon: '✅',
        },
        info: {
            bg: 'bg-blue-50/90 border-blue-200',
            text: 'text-blue-900',
            subtext: 'text-blue-700',
            icon: 'ℹ️',
        },
        warning: {
            bg: 'bg-amber-50/90 border-amber-200',
            text: 'text-amber-900',
            subtext: 'text-amber-700',
            icon: '⚠️',
        },
        danger: {
            bg: 'bg-rose-50/90 border-rose-200',
            text: 'text-rose-900',
            subtext: 'text-rose-700',
            icon: '🚨',
        }
    }[type] || {
        bg: 'bg-blue-50/90 border-blue-200',
        text: 'text-blue-900',
        subtext: 'text-blue-700',
        icon: 'ℹ️',
    };

    return (
        <div
            className={`flex flex-row items-center gap-3 p-4 rounded-2xl border ${alertColors.bg} ${className}`}
            action={action}
        >
            <span className="text-xl">{alertColors.icon}</span>
            <div className="flex flex-col flex-1 gap-0.5">
                {title && <span className={`font-black text-xs ${alertColors.text}`}>{title}</span>}
                {message && <span className={`text-[10px] ${alertColors.subtext}`}>{message}</span>}
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
                <div className="text-white text-2xl font-bold px-2 pr-4" action="drawer:open">
                    ☰
                </div>
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

                        {/* E. Floating Label Input Demo */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-black uppercase">Style E: Floating Label</span>
                            <input
                                type="text"
                                variant="outlined"
                                stateKey="floating_label_demo"
                                label="Floating Label Input"
                                placeholder="Click me to see floating effect"
                                className="w-full border-blue-500"
                            />
                        </div>

                        {/* F. Old HTML Style Input */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-black uppercase">Style F: Old HTML Style</span>
                            <span className="text-sm font-bold text-slate-700 ml-1">Static Label Outside</span>
                            <input
                                type="text"
                                variant="outlined"
                                stateKey="static_label_demo"
                                placeholder="I just disappear when you type"
                                className="w-full border-gray-400"
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

                <div className="h-12 w-full" />
            </div>

            {/* Bottom Navigation (Fixed) */}
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
                <div className="text-white text-2xl font-bold px-2 pr-4" action="drawer:open">
                    ☰
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

                {/* Custom Inline Alert Banner Components Showcase */}
                <div className="flex flex-col gap-3 m-4">
                    <span className="text-slate-400 text-[10px] uppercase font-black">Native Reusable Alert Library:</span>

                    <Alert
                        type="success"
                        title="Dynamic Cryptography Active"
                        message="All offline states are securely encrypted in Android SQLite keystore."
                    />

                    <Alert
                        type="info"
                        title="Dolphin Socket Connected"
                        message="Developer server connected on port 9091 with 0ms hot-reload."
                    />

                    <Alert
                        type="warning"
                        title="High Theme Level Warning"
                        message="Running high dynamic contrast. Color brightness is automatically capped."
                    />

                    <Alert
                        type="danger"
                        title="Keystore Reset Required"
                        message="Please reset offline states if you change key bindings."
                        action="form:reset"
                    />
                </div>

                <div className="h-12 w-full" />
            </div>

            {/* Bottom Navigation (Fixed) */}
            {SharedTabBar('Details')}
        </div>
    );
};

const buildBootstrapScreen = () => {
    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:theme">
            {/* Header / AppBar */}
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-10 pb-4 shadow-md w-full">
                <div className="text-white text-2xl font-bold px-2 pr-4" action="drawer:open">
                    ☰
                </div>
                <div className="flex-1" />
                <span className="text-white font-black text-lg">🥾 Bootstrap Form</span>
                <div className="flex-1" />
            </div>

            {/* Form scrollable container */}
            <div type="ListView" className="flex-1 p-0">
                <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-5">
                    <span className="text-slate-800 font-extrabold text-lg mb-2">Complete Bootstrap Form</span>

                    <div className="flex flex-col gap-1">
                        <span className="text-slate-600 font-bold text-xs">Full Name</span>
                        <input
                            type="text"
                            variant="outlined"
                            stateKey="bs_name"
                            placeholder="John Doe"
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-slate-600 font-bold text-xs">Email Address</span>
                        <input
                            type="email"
                            variant="outlined"
                            stateKey="bs_email"
                            placeholder="name@example.com"
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-slate-600 font-bold text-xs">Password</span>
                        <input
                            type="password"
                            variant="outlined"
                            stateKey="bs_new_pass"
                            placeholder="••••••••"
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-slate-600 font-bold text-xs">Age</span>
                        <input
                            type="number"
                            variant="outlined"
                            stateKey="bs_age"
                            placeholder="18"
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-slate-600 font-bold text-xs">Date of Birth</span>
                        <input
                            type="text"
                            variant="outlined"
                            stateKey="bs_dob"
                            placeholder="YYYY-MM-DD"
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-slate-600 font-bold text-xs">Country</span>
                        <div
                            type="Select"
                            stateKey="bs_country"
                            options="Nepal,India,USA,UK,Australia"
                            value="Nepal"
                            className="w-full border-gray-400 p-2 rounded-md bg-white border"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <span className="text-slate-600 font-bold text-xs">Gender</span>
                        <div className="flex flex-row gap-4">
                            <div type="Radio" stateKey="bs_gender_m" label="Male" className="flex-1" />
                            <div type="Radio" stateKey="bs_gender_f" label="Female" className="flex-1" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <div type="Checkbox" stateKey="agree_terms" label="I agree to terms and conditions" className="w-full p-2" />
                        <div type="Checkbox" stateKey="newsletter" label="Subscribe to newsletter" className="w-full p-2" />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <div type="Checkbox" stateKey="bs_notif" label="Receive Notifications" className="w-full p-2" />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <span className="text-slate-600 font-bold text-xs">Volume / Range</span>
                        <div type="Slider" stateKey="bs_range" initial={50} className="w-full" />
                    </div>

                    <div className="mt-4 flex flex-row gap-4">
                        <div
                            className="flex-1 bg-blue-600 py-4 px-6 rounded-2xl items-center justify-center active:scale-95 transition-all shadow-md"
                            action="form:bs_submit"
                        >
                            <span className="text-white font-extrabold text-sm">SUBMIT FORM</span>
                        </div>
                    </div>
                </div>

                <div className="h-12 w-full" />
            </div>

            {/* Bottom Navigation (Fixed) */}
            {SharedTabBar('Bootstrap')}
        </div>
    );
};

// DRAWER SCREEN: Left Sidebar Menu Panel
const buildMainDrawerScreen = () => {
    return (
        <div className="flex flex-col h-full bg-slate-stateKey:theme">
            {/* Drawer Header with Premium Gradient */}
            <div className="flex flex-col bg-gradient-horiz-indigo-153-purple-153 px-6 pt-12 pb-6 shadow-md gap-3 w-full">
                <div className="flex flex-row items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 items-center justify-center border-2 border-white/40 shadow-inner">
                        <span className="text-white text-3xl font-black">🐬</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-extrabold text-base tracking-wide">Dolphin Lab Pro</span>
                        <span className="text-white/80 text-[10px] font-medium mt-0.5 uppercase tracking-widest">Nepal Core Team</span>
                    </div>
                </div>
                <span className="text-white/60 text-[10px] font-mono mt-1 select-all">dev-admin@dolphin-native.io</span>
            </div>

            {/* Drawer Items */}
            <div type="ListView" className="flex-1 p-4 gap-2">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-widest ml-3 mb-2">Navigation Panel</span>

                {/* Home Item */}
                <div
                    className="flex flex-row items-center gap-4 p-3 rounded-2xl bg-white/10 active:scale-98 transition-all hover:bg-white/20 border border-slate-100/5"
                    action="nav:Home"
                >
                    <span className="text-xl">🧪</span>
                    <span className="text-slate-700 font-extrabold text-xs">Form Laboratory</span>
                </div>

                {/* Bootstrap Item */}
                <div
                    className="flex flex-row items-center gap-4 p-3 rounded-2xl bg-white/10 active:scale-98 transition-all hover:bg-white/20 border border-slate-100/5"
                    action="nav:Bootstrap"
                >
                    <span className="text-xl">🥾</span>
                    <span className="text-slate-700 font-extrabold text-xs">Bootstrap Form</span>
                </div>

                {/* Preview Item */}
                <div
                    className="flex flex-row items-center gap-4 p-3 rounded-2xl bg-white/10 active:scale-98 transition-all hover:bg-white/20 border border-slate-100/5"
                    action="nav:Details"
                >
                    <span className="text-xl">🔍</span>
                    <span className="text-slate-700 font-extrabold text-xs">Live Preview</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200/50 my-2 w-full" />

                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-widest ml-3 mb-2">Quick Actions</span>

                {/* Toggle Flash Action */}
                <div
                    className="flex flex-row items-center gap-4 p-3 rounded-2xl bg-white/10 active:scale-98 transition-all hover:bg-white/20 border border-slate-100/5"
                    action="TOGGLE_FLASH"
                >
                    <span className="text-xl">💡</span>
                    <span className="text-slate-700 font-extrabold text-xs">Toggle Flashlight</span>
                </div>

                {/* Reset Action */}
                <div
                    className="flex flex-row items-center gap-4 p-3 rounded-2xl bg-white/10 active:scale-98 transition-all hover:bg-white/20 border border-slate-100/5"
                    action="form:reset"
                >
                    <span className="text-xl">🔄</span>
                    <span className="text-slate-700 font-extrabold text-xs">Reset All States</span>
                </div>

                {/* Simulated Call Action */}
                <div
                    className="flex flex-row items-center gap-4 p-3 rounded-2xl bg-white/10 active:scale-98 transition-all hover:bg-white/20 border border-slate-100/5"
                    action="simulateAudioCall"
                >
                    <span className="text-xl">📞</span>
                    <span className="text-slate-700 font-extrabold text-xs">Simulate Audio Call</span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center justify-center p-6 border-t border-slate-100/5 gap-1 bg-slate-50/5">
                <span className="text-[10px] font-bold text-slate-400">Dolphin Native Runtime</span>
                <span className="text-[9px] font-black text-slate-300 tracking-wider">MADE IN NEPAL WITH 💖</span>
            </div>
        </div>
    );
};

// Register screens
app.screen('Home', buildHomeScreen());
app.screen('Bootstrap', buildBootstrapScreen());
app.screen('Details', buildDetailsScreen());
app.screen('MainDrawer', buildMainDrawerScreen());

app.drawer('MainDrawer');
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

app.action('form:bs_submit', async () => {
    app.alert('सफलता! 🎉', 'तपाईंको बुटस्ट्र्याप फारम डाटा सफलतापूर्वक पेस गरियो।');
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

// Wildcard Drawer handler
app.action('drawer:*', async (action) => {
    const cmd = action.slice(7); // "open" or "close"
    if (cmd === 'open') {
        app.openDrawer('MainDrawer');
    }
});

module.exports = app;
