'use strict';

const { DolphinFramework } = require('../src/framework/DolphinFramework');

const app = DolphinFramework.createApp({
    name: 'Dolphin HTML Parser Test',
    platform: 'HTML',
    debug: true,
});

// Initial State for nesting test
app.state('counter', 0);
app.state('test_theme', 150);
app.state('message', 'हाम्रो Parser ले nested HTML १००% सपोर्ट गर्छ!');

// Reusable Shared Tab Bar
const SharedTabBar = (activeScreen) => (
    <div className="flex flex-row bg-gradient-horiz-indigo-153-purple-153 border-t border-indigo-700 flex-shrink-0 shadow-2xl" style={{ height: 80 }}>
        <div className={`flex flex-col flex-1 p-2 items-center justify-center transition-all ${activeScreen === 'Home' ? 'bg-indigo-900/40' : ''}`} action="nav:Home">
            <span className="text-2xl mb-0.5 text-center">🏠</span>
            <span className={`text-[10px] font-extrabold tracking-wide text-center ${activeScreen === 'Home' ? 'text-white' : 'text-indigo-200'}`}>HOME</span>
            <div className="w-0 h-0" />
        </div>
        <div className={`flex flex-col flex-1 p-2 items-center justify-center transition-all ${activeScreen === 'Details' ? 'bg-indigo-900/40' : ''}`} action="nav:Details">
            <span className="text-2xl mb-0.5 text-center">✨</span>
            <span className={`text-[10px] font-extrabold tracking-wide text-center ${activeScreen === 'Details' ? 'text-white' : 'text-indigo-200'}`}>DETAILS</span>
            <div className="w-0 h-0" />
        </div>
    </div>
);

// HOME SCREEN — Demonstrates deep nested HTML structures (div, ul, li, span, p)
const buildHomeScreen = () => {
    const counter = app.getState('counter') || 0;
    const message = app.getState('message') || '';

    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:test_theme">
            {/* Nested Top Bar */}
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-4 pb-4 shadow-md w-full">
                <div className="flex-1 flex flex-col justify-center items-center w-full">
                    <span className="text-white font-black text-xl tracking-wider">🧬 NESTED HTML TESTER</span>
                    <span className="text-indigo-100 text-[10px] font-bold tracking-widest mt-1">DOLPHIN NATIVE RENDERER</span>
                </div>
            </div>

            {/* Main scrollable body */}
            <div type="ListView" className="flex-1 p-0">
                
                {/* 1. Deep Nested Card Test */}
                <div className="card bg-slate-stateKey:test_theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">📦</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Deep Nested Container Test</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">div &gt; div &gt; div &gt; span</span>
                        </div>
                    </div>

                    {/* Highly nested blocks */}
                    <div className="bg-slate-stateKey:test_theme p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                        <div className="bg-slate-stateKey:test_theme p-3 rounded-xl flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-500 items-center justify-center">
                                    <span className="text-white text-xs font-bold">1</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-800 font-extrabold text-xs">Level 3 nesting tag</span>
                                    <span className="text-slate-500 text-[10px]">{message}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. UL & LI List Nested Test */}
                <div className="card bg-slate-stateKey:test_theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">📋</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Nested Lists (ul &amp; li) Test</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">unordered list with spans</span>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-3 p-0 m-0">
                        <li className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 flex flex-row items-center gap-3">
                            <span className="text-xl">🚀</span>
                            <div className="flex flex-col flex-1">
                                <span className="text-indigo-950 font-extrabold text-xs">List Item 1</span>
                                <span className="text-indigo-700 text-[10px]">Parser dynamically promoted this li content!</span>
                            </div>
                        </li>
                        <li className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100 flex flex-row items-center gap-3">
                            <span className="text-xl">✨</span>
                            <div className="flex flex-col flex-1">
                                <span className="text-purple-950 font-extrabold text-xs">List Item 2</span>
                                <span className="text-purple-700 text-[10px]">Nested components: span, div, raw text.</span>
                            </div>
                        </li>
                        <li className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 flex flex-row items-center gap-3">
                            <span className="text-xl">✅</span>
                            <div className="flex flex-col flex-1">
                                <span className="text-emerald-950 font-extrabold text-xs">List Item 3</span>
                                <span className="text-emerald-700 text-[10px]">100% compliant with standard CSS layout rules.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* 3. Interactive Nested State Bound Panel */}
                <div className="card bg-slate-stateKey:test_theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-3">
                        <span className="text-2xl">🎛️</span>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-extrabold text-sm">Interactive Reactive Nesting</span>
                            <span className="text-slate-400 text-[10px] uppercase font-black">state bindings &amp; actions</span>
                        </div>
                    </div>

                    <div className="bg-slate-stateKey:test_theme p-4 rounded-2xl flex flex-col items-center justify-center gap-4">
                        <div className="flex flex-row items-center gap-4">
                            <div className="bg-red-500 w-12 h-12 rounded-full items-center justify-center shadow-md" action="counter:-1">
                                <span className="text-white text-xl font-bold">-</span>
                            </div>
                            <div className="flex flex-col items-center justify-center px-4" style={{ width: 100 }}>
                                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">COUNTER</span>
                                <span className="text-indigo-600 font-black text-3xl">stateKey:counter|0</span>
                            </div>
                            <div className="bg-green-500 w-12 h-12 rounded-full items-center justify-center shadow-md" action="counter:+1">
                                <span className="text-white text-xl font-bold">+</span>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 w-full" />

                        {/* Theme Slider Control */}
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-slate-700 font-extrabold text-xs">Test Theme Depth:</span>
                            <input type="range" stateKey="test_theme" initial="150" min="10" max="245" className="w-full" />
                        </div>
                    </div>
                </div>

                <div className="h-24 w-full" />
            </div>

            {/* Bottom Nav */}
            {SharedTabBar('Home')}
        </div>
    );
};

// DETAILS SCREEN
const buildDetailsScreen = () => {
    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:test_theme">
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-10 pb-4 shadow-md w-full">
                <div className="text-white text-xl font-bold px-2" action="nav:back">
                    &lt;
                </div>
                <div className="flex-1" />
                <span className="text-white font-black text-base">Detail Panel</span>
                <div className="flex-1" />
            </div>

            <div className="flex-1 items-center justify-center p-8">
                <span className="text-6xl mb-4">🧬</span>
                <span className="text-slate-800 font-extrabold text-xl">Nested HTML Analyzer</span>
                <span className="text-slate-400 text-xs mt-2 text-center leading-relaxed">
                    Dolphin Native successfully builds robust binary structures recursively!
                </span>
                <div className="bg-gradient-horiz-indigo-153-purple-153 py-4 px-8 rounded-2xl items-center justify-center shadow-lg mt-6" action="nav:Home">
                    <span className="text-white font-extrabold text-sm">BACK TO TEST HOME</span>
                </div>
            </div>

            {SharedTabBar('Details')}
        </div>
    );
};

// Screen Registration
app.screen('Home', buildHomeScreen());
app.screen('Details', buildDetailsScreen());

app.entry('Home');

// ACTION HANDLERS
// (The counter buttons are handled 100% offline via native state bindings to prevent scroll resets!)

// Wildcard routing handler
app.action('nav:*', async (action) => {
    const rawPath = action.slice(4); // e.g. "Details" or "back"
    const screenName = rawPath.split('?')[0];

    if (screenName === 'back') {
        app.navigate('Home');
        return;
    }
    app.navigate(screenName);
});

module.exports = app;
