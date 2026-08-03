'use strict';

// 🐬 DOLPHIN NATIVE — app.jsx (High-Fidelity E-Commerce App) [Sync Enabled]
const { DolphinFramework, Image } = require('../src/framework/DolphinFramework');

// ─── Create App ──────────────────────────────────────────────
const app = DolphinFramework.createApp({
    name: 'Dolphin Premium Store',
    platform: 'HTML', // High-performance HTML-to-Native routing mode
    debug: true,
});

// ─── Initial State ──────────────────────────────────────────
app.state('products', [
    {
        id: 1,
        title: 'Fjallraven - Foldsack No. 1 Backpack',
        price: 109.95,
        category: "men's clothing",
        image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
        description: 'Your perfect pack for everyday use and walks in the forest. Stashes your laptop (up to 15 inches) in the padded sleeve.'
    },
    {
        id: 2,
        title: 'Mens Casual Slim Fit T-Shirts',
        price: 22.30,
        category: "men's clothing",
        image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
        description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.'
    },
    {
        id: 3,
        title: 'Mens Cotton Jacket',
        price: 55.99,
        category: "men's clothing",
        image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
        description: 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.'
    }
]);
app.state('cart', []);
app.state('cart_count', 0);
app.state('is_loading', false);
app.state('selected_product', null);
app.state('selected_category', 'All');
app.state('theme', 128); // Initialize theme slider state
app.state('quick_message', ''); // Quick action message notification state

// ─── Global Tab Bar Component ────────────────────────────────
const SharedTabBar = (activeScreen) => (
    <div className="flex flex-row bg-gradient-horiz-indigo-153-purple-153 border-t border-indigo-700 flex-shrink-0 shadow-2xl" style={{ height: 80 }}>
        <div className={`flex flex-col flex-1 p-2 items-center justify-center transition-all ${activeScreen === 'Home' ? 'bg-indigo-900/40' : ''}`} action="nav:Home">
            <span className="text-2xl mb-0.5 text-center">🏠</span>
            <span className={`text-[10px] font-extrabold tracking-wide text-center ${activeScreen === 'Home' ? 'text-white' : 'text-indigo-200'}`}>HOME</span>
            <div className="w-0 h-0" />
        </div>
        <div className={`flex flex-col flex-1 p-2 items-center justify-center transition-all ${activeScreen === 'Cart' ? 'bg-indigo-900/40' : ''}`} action="nav:Cart">
            <div className="flex flex-row items-center justify-center">
                <span className="text-2xl mb-0.5 text-center">🛒</span>
                {app.getState('cart_count') > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full -ml-2 -mt-3">
                        {app.getState('cart_count')}
                    </span>
                )}
            </div>
            <span className={`text-[10px] font-extrabold tracking-wide text-center ${activeScreen === 'Cart' ? 'text-white' : 'text-indigo-200'}`}>CART</span>
            <div className="w-0 h-0" />
        </div>
        <div className={`flex flex-col flex-1 p-2 items-center justify-center transition-all ${activeScreen === 'Details' ? 'bg-indigo-900/40' : ''}`} action="nav:Details">
            <span className="text-2xl mb-0.5 text-center">✨</span>
            <span className={`text-[10px] font-extrabold tracking-wide text-center ${activeScreen === 'Details' ? 'text-white' : 'text-indigo-200'}`}>DETAILS</span>
            <div className="w-0 h-0" />
        </div>
    </div>
);

// ─── Quick Actions Menu Component (eSewa / Bank style) ───────
const QuickActionsMenu = () => {
    const actions = [
        { name: 'Load Wallet', icon: '💳', color: 'bg-emerald-500', action: 'app:quick_action:load_wallet' },
        { name: 'Send Money', icon: '💸', color: 'bg-indigo-500', action: 'app:quick_action:send_money' },
        { name: 'Bank Transfer', icon: '🏦', color: 'bg-purple-500', action: 'app:quick_action:bank_transfer' },
        { name: 'Top Up', icon: '📱', color: 'bg-amber-500', action: 'app:quick_action:top_up' },
        { name: 'Electricity', icon: '⚡', color: 'bg-cyan-500', action: 'app:quick_action:electricity' },
        { name: 'Khanepani', icon: '💧', color: 'bg-blue-500', action: 'app:quick_action:khanepani' },
        { name: 'Govt Payment', icon: '🏛️', color: 'bg-rose-500', action: 'app:quick_action:govt_payment' },
        { name: 'TV TV Bills', icon: '📺', color: 'bg-orange-500', action: 'app:quick_action:tv_bills' },
    ];

    return (
        <div className="card bg-slate-stateKey:theme m-4 p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row items-center gap-2">
                    <span className="text-xl">✨</span>
                    <span className="text-slate-800 font-extrabold text-sm">Quick Services (सजिलो भुक्तानी)</span>
                </div>
                <span className="text-indigo-600 font-black text-xs" action="app:quick_action:all_services">SEE ALL</span>
            </div>
            
            <div className="flex flex-row gap-4 scroll-x overflow-x-scroll pb-2 w-full">
                {actions.map((act, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-1" style={{ width: 80 }} action={act.action}>
                        <div className={`w-14 h-14 rounded-2xl ${act.color} items-center justify-center shadow-md mb-2`}>
                            <span className="text-2xl">{act.icon}</span>
                        </div>
                        <span className="text-slate-700 font-extrabold text-[10px] text-center w-full whitespace-nowrap" style={{ maxHeight: 15 }}>
                            {act.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════
const buildHomeScreen = () => {
    const products = app.getState('products') || [];
    const loading = app.getState('is_loading') || false;
    const cartCount = app.getState('cart_count') || 0;
    const selectedCategory = app.getState('selected_category') || 'All';

    // Safe filtering based on selected category
    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

    const categories = ['All', "Men's Clothing", 'Electronics', 'Jewelery', "Women's Clothing"];

    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:theme">
            {/* Custom Transparent Premium AppBar */}
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-4 pb-4 shadow-md w-full">
                <div className="text-white text-2xl font-bold px-2" action="drawer:open">☰</div>
                <div className="flex-1" />
                <div className="text-white font-extrabold text-xl tracking-wider">🐬 DOLPHIN Store</div>
                <div className="flex-1" />
                <div className="flex flex-row items-center bg-indigo-700 px-4 py-2 rounded-full shadow-inner" action="nav:Cart">
                    <div className="text-base mr-1">🛒</div>
                    <div className="text-white text-xs font-black">{cartCount}</div>
                </div>
            </div>

            {/* Main Body */}
            <div type="ListView" className="flex-1 p-0">
                {/* 🎛️ Dynamic Theme Control Slider (As requested by the user) */}
                <div className="p-5 bg-slate-stateKey:theme m-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-lg">🎛️</span>
                        <span className="text-slate-800 font-extrabold text-sm">Dynamic Background Theme Slider</span>
                    </div>
                    <span className="text-slate-400 text-xs leading-relaxed">
                        Slide this custom range control to adjust the background color depth in real-time dynamically using state bindings!
                    </span>
                    <div className="flex flex-row items-center gap-4 mt-2 w-full">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MIN</span>
                        <div className="flex-1">
                            <input type="range" stateKey="theme" initial="128" min="10" max="240" className="w-full" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MAX</span>
                    </div>
                </div>

                {/* Hero Header Banner */}
                <div className="m-4 p-6 rounded-3xl shadow-xl flex flex-col justify-center"
                    gradient="gradient-indigo-600-purple-800-45"
                    style={{ height: 180 }}>
                    <span className="text-white text-2xl font-black">Summer Collection 2026</span>
                    <span className="text-indigo-200 text-sm mt-1">Get up to 50% off on premium products</span>
                    <div className="flex flex-row items-center mt-6">
                        <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-md" action="app:fetch_products">
                            <span className="text-white font-bold text-xs">🔄 SYNCHRONIZE API</span>
                        </div>
                    </div>
                </div>

                {/* Quick Action Notification Banner */}
                {app.getState('quick_message') && (
                    <div className="m-4 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-row items-center justify-between shadow-sm" action="app:clear_quick_message">
                        <div className="flex flex-row items-center gap-3">
                            <span className="text-xl">🔔</span>
                            <span className="text-indigo-900 font-extrabold text-xs">{app.getState('quick_message')}</span>
                        </div>
                        <span className="text-slate-400 font-black text-xs">✕</span>
                    </div>
                )}

                {/* eSewa / Bank Style Quick Actions Scroll Menu */}
                {QuickActionsMenu()}

                {/* API Sync Status Indicator */}
                <div className="px-4 py-2">
                    <div className={`p-4 rounded-2xl flex flex-row items-center shadow-sm border ${loading ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                        <span className="text-xl mr-3">{loading ? '🔄' : '✅'}</span>
                        <div className="flex-1 flex flex-col">
                            <span className={`font-bold text-sm ${loading ? 'text-amber-800' : 'text-green-800'}`}>
                                {loading ? 'Fetching Cloud Store...' : 'Cloud Database Synced'}
                            </span>
                            <span className={`text-xs mt-0.5 ${loading ? 'text-amber-600' : 'text-green-600'}`}>
                                {loading ? 'Downloading products from FakeStoreAPI' : `Showing ${filteredProducts.length} items from cloud stream`}
                            </span>
                        </div>
                        {!loading && (
                            <div className="bg-green-600 text-white font-bold text-xs px-3 py-1.5 rounded-full" action="app:fetch_products">
                                FETCH
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories Filter list */}
                <div className="p-4">
                    <span className="text-slate-800 font-extrabold text-lg mb-3 block">Categories</span>
                    <div className="flex flex-row gap-3 scroll-x overflow-x-scroll pb-2 w-full">
                        {categories.map(cat => {
                            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                            return (
                                <div key={cat}
                                    className={`px-5 py-3 rounded-2xl border transition-all ${isSelected ? 'bg-gradient-horiz-indigo-153-purple-153 border-indigo-700' : 'bg-white border-slate-200 shadow-sm'}`}
                                    action={`app:filter_category:${cat}`}>
                                    <span className={`font-bold text-xs whitespace-nowrap ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                        {cat}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Featured Products Grid */}
                <div className="p-4">
                    <span className="text-slate-800 font-extrabold text-xl mb-5 block">Featured Products</span>
                    <div className="flex flex-col gap-5">
                        {filteredProducts.map(p => (
                            <div key={p.id}
                                className="card bg-slate-stateKey:theme p-4 rounded-3xl shadow-md border border-slate-100 flex flex-row items-center w-full"
                                action={`nav:Details?id=${p.id}`}>
                                <Image src={p.image} className="w-24 h-24 rounded-2xl mr-4" width={100} height={100} />
                                <div className="flex-1 flex flex-col justify-between" style={{ height: 100 }}>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{p.category}</span>
                                        <span className="text-slate-800 font-bold text-sm mt-1" style={{ maxHeight: 40 }}>{p.title}</span>
                                    </div>
                                    <div className="flex flex-row justify-between items-center mt-2 w-full">
                                        <span className="text-indigo-600 font-black text-base">${p.price}</span>
                                        <div className="bg-gradient-horiz-indigo-153-purple-153 px-4 py-2 rounded-xl" action={`app:add_to_cart:${p.id}`}>
                                            <span className="text-white text-xs font-black">ADD</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spacing element at bottom */}
                <div className="h-24 w-full" />
            </div>

            {/* Bottom Navigation */}
            {SharedTabBar('Home')}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// PRODUCT DETAILS SCREEN
// ═══════════════════════════════════════════════════════════
const buildDetailsScreen = () => {
    const p = app.getState('selected_product') || app.getState('products')[0];

    if (!p) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center bg-slate-stateKey:theme">
                <span className="text-5xl mb-4">🔍</span>
                <span className="text-slate-400 font-bold">No Product Selected</span>
                <div className="bg-gradient-horiz-indigo-153-purple-153 py-3 px-6 rounded-full mt-4" action="nav:Home">
                    <span className="text-white font-bold text-sm">Go Home</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:theme">
            {/* AppBar with Back Navigation */}
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-10 pb-4 shadow-md w-full">
                <div className="text-white text-xl font-bold px-2" action="nav:back">
                    &lt;
                </div>
                <div className="flex-1" />
                <span className="text-white font-black text-base">Product Details</span>
                <div className="flex-1" />
                <div className="flex flex-row items-center bg-slate-100 px-3 py-1.5 rounded-full" action="nav:Cart">
                    <span className="text-sm mr-1">🛒</span>
                    <span className="text-slate-800 text-xs font-black">{app.getState('cart_count')}</span>
                </div>
            </div>

            {/* Product Body details */}
            <div type="ListView" className="flex-1 p-0">
                <div className="p-6 bg-slate-50 items-center justify-center w-full">
                    <Image src={p.image} className="w-64 h-64 rounded-3xl shadow-xl" width={240} height={240} />
                </div>

                <div className="p-6">
                    <span className="text-indigo-600 font-black text-xs uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full">
                        {p.category}
                    </span>
                    <h1 className="text-2xl font-black text-slate-800 mt-4">{p.title}</h1>

                    <div className="flex flex-row items-center gap-3 mt-4">
                        <span className="text-indigo-600 font-black text-3xl">${p.price}</span>
                        <div className="flex-1" />
                        <span className="text-slate-400 text-sm">⭐ 4.8 (120 reviews)</span>
                    </div>

                    <div className="h-px bg-slate-100 my-6" />

                    <h3 className="text-slate-800 font-bold text-base mb-2">Description</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{p.description}</p>

                    <div className="h-px bg-slate-100 my-6" />

                    {/* Premium Add To Cart CTAs */}
                    <div className="flex flex-row gap-4 mt-4 w-full">
                        <div className="flex-1 bg-gradient-horiz-indigo-153-purple-153 py-4 rounded-2xl items-center justify-center shadow-lg"
                            action={`app:add_to_cart:${p.id}`}>
                            <span className="text-white font-extrabold text-base">ADD TO CART</span>
                        </div>
                        <div className="bg-slate-100 px-5 py-4 rounded-2xl items-center justify-center border border-slate-200"
                            action="nav:Cart">
                            <span className="text-slate-700 font-bold text-sm">BUY NOW</span>
                        </div>
                    </div>
                </div>
                <div className="h-24 w-full" />
            </div>

            {/* Bottom Tab Bar */}
            {SharedTabBar('Details')}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// CART SCREEN
// ═══════════════════════════════════════════════════════════
const buildCartScreen = () => {
    const cart = app.getState('cart') || [];
    const cartCount = app.getState('cart_count') || 0;

    // Calculate dynamic total price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);

    return (
        <div className="flex flex-col flex-1 bg-slate-stateKey:theme">
            {/* AppBar */}
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-10 pb-4 shadow-md w-full">
                <div className="text-white text-xl font-bold px-2" action="nav:back">
                    &lt;
                </div>
                <div className="flex-1" />
                <span className="text-white font-extrabold text-xl tracking-wider">MY CART</span>
                <div className="flex-1" />
                <div className="text-white text-xs font-bold" action="app:clear_cart">
                    CLEAR
                </div>
            </div>

            {/* Cart Body */}
            {cartCount === 0 ? (
                <div className="flex-1 items-center justify-center p-8">
                    <span className="text-6xl mb-4">🛍️</span>
                    <span className="text-slate-800 font-extrabold text-xl">Your Cart is Empty</span>
                    <span className="text-slate-400 text-xs mt-2 text-center">
                        Add items from our premium selection to start shopping!
                    </span>
                    <div className="bg-gradient-horiz-indigo-153-purple-153 py-4 px-8 rounded-2xl items-center justify-center shadow-lg mt-6"
                        action="nav:Home">
                        <span className="text-white font-extrabold text-sm">EXPLORE PRODUCTS</span>
                    </div>
                </div>
            ) : (
                <div type="ListView" className="flex-1 p-0">
                    <div className="p-4">
                        <span className="text-slate-800 font-extrabold text-lg mb-4 block">Cart Items ({cartCount})</span>
                        <div className="flex flex-col gap-4">
                            {cart.map(item => (
                                <div key={item.id} className="card bg-slate-stateKey:theme p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-row items-center w-full">
                                    <Image src={item.image} className="w-16 h-16 rounded-xl mr-4" width={60} height={60} />
                                    <div className="flex-1 flex flex-col justify-center">
                                        <span className="text-slate-800 font-bold text-sm" style={{ maxHeight: 20 }}>{item.title}</span>
                                        <div className="flex flex-row items-center justify-between mt-2 w-full">
                                            <span className="text-indigo-600 font-black text-sm">${item.price}</span>
                                            <div className="flex flex-row items-center gap-3">
                                                <div className="bg-slate-100 w-8 h-8 rounded-full items-center justify-center border border-slate-200"
                                                    action={`app:remove_from_cart:${item.id}`}>
                                                    <span className="text-slate-600 font-bold text-sm">-</span>
                                                </div>
                                                <span className="text-slate-800 font-bold text-sm">{item.quantity || 1}</span>
                                                <div className="bg-slate-100 w-8 h-8 rounded-full items-center justify-center border border-slate-200"
                                                    action={`app:add_to_cart:${item.id}`}>
                                                    <span className="text-slate-600 font-bold text-sm">+</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Summary Card */}
                    <div className="p-4">
                        <div className="bg-slate-stateKey:theme p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col gap-4">
                            <span className="text-slate-800 font-extrabold text-base">Order Summary</span>
                            <div className="flex flex-row justify-between w-full">
                                <span className="text-slate-400 text-sm">Subtotal</span>
                                <span className="text-slate-800 font-bold text-sm">${totalPrice}</span>
                            </div>
                            <div className="flex flex-row justify-between w-full">
                                <span className="text-slate-400 text-sm">Shipping</span>
                                <span className="text-green-600 font-bold text-sm">FREE</span>
                            </div>
                            <div className="h-px bg-slate-100 my-1" />
                            <div className="flex flex-row justify-between w-full">
                                <span className="text-slate-800 font-extrabold text-base">Total Price</span>
                                <span className="text-indigo-600 font-black text-xl">${totalPrice}</span>
                            </div>

                            <div className="bg-gradient-horiz-indigo-153-purple-153 py-4 rounded-2xl items-center justify-center shadow-lg mt-4"
                                action="app:checkout">
                                <span className="text-white font-extrabold text-sm uppercase">PROCEED TO CHECKOUT</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-24 w-full" />
                </div>
            )}

            {/* Bottom Tab Bar */}
            {SharedTabBar('Cart')}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// MAIN DRAWER NAVIGATION
// ═══════════════════════════════════════════════════════════
const MainDrawer = (
    <div className="flex flex-col flex-1 bg-slate-stateKey:theme" style={{ width: 300 }}>
        {/* Header Drawer Banner */}
        <div className="p-8 bg-gradient-horiz-indigo-153-purple-153 flex flex-col">
            <span className="text-white text-3xl font-black">🐬 Dolphin App</span>
            <span className="text-indigo-200 text-xs mt-1">E-Commerce Framework v4.2</span>
        </div>

        {/* Menu Items */}
        <div type="ListView" className="p-4 flex-1">
            <div className="flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-row items-center" action="nav:Home">
                    <span className="text-2xl mr-4">🏠</span>
                    <span className="text-base font-extrabold text-indigo-900">Home Store</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-row items-center" action="nav:Cart">
                    <span className="text-2xl mr-4">🛒</span>
                    <span className="text-base font-bold text-slate-800">Shopping Cart</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-row items-center" action="app:fetch_products">
                    <span className="text-2xl mr-4">🔄</span>
                    <span className="text-base font-bold text-slate-800">Fetch API Data</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-row items-center" action="TOGGLE_FLASH">
                    <span className="text-2xl mr-4">💡</span>
                    <span className="text-base font-bold text-slate-800">Toggle Flashlight</span>
                </div>
            </div>
        </div>

        {/* Bottom copyright info */}
        <div className="p-6 border-t border-slate-100 items-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                © 2026 Dolphin E-Commerce
            </span>
        </div>
    </div>
);

// ─── Screen Registration ──────────────────────────────────
app.screen('Home', buildHomeScreen());
app.screen('Details', buildDetailsScreen());
app.screen('Cart', buildCartScreen());
app.screen('MainDrawer', MainDrawer);

app.drawer('MainDrawer');
app.entry('Home');

// ═══════════════════════════════════════════════════════════
// MODULAR ACTION HANDLERS
// ═══════════════════════════════════════════════════════════

// Fetch Products from FakeStoreAPI
app.action('app:fetch_products', async () => {
    app.state('is_loading', true);
    app.screen('Home', buildHomeScreen());
    app.patchScreen('Home');

    console.log('📥 Fetching from FakeStoreAPI (with Axios/Fetch robust engine)...');
    let productsArray = [];

    // Method 1: Robust Axios request (Since Axios is installed and handles timeouts/headers exceptionally well)
    try {
        const axios = require('axios');
        console.log('   🔄 Attempting Axios download...');
        const response = await axios.get('https://fakestoreapi.com/products', {
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Encoding': 'identity'
            }
        });
        if (response.data && (Array.isArray(response.data) || typeof response.data === 'object')) {
            const data = response.data;
            if (Array.isArray(data)) productsArray = data;
            else if (data && Array.isArray(data.products)) productsArray = data.products;
            console.log(`   ✅ Axios succeeded: loaded ${productsArray.length} items`);
        }
    } catch (e) {
        console.warn('   ⚠️ Axios fetch failed, trying native fetch...', e.message);
    }

    // Method 2: Native Fetch Fallback (if Axios failed or threw)
    if (productsArray.length === 0) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        try {
            console.log('   🔄 Attempting global fetch...');
            const res = await fetch('https://fakestoreapi.com/products', {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json'
                }
            });
            clearTimeout(timeoutId);
            const data = await res.json();
            if (Array.isArray(data)) productsArray = data;
            else if (data && Array.isArray(data.products)) productsArray = data.products;
            console.log(`   ✅ Fetch succeeded: loaded ${productsArray.length} items`);
        } catch (e) {
            console.warn('   ⚠️ Global fetch failed:', e.message);
            clearTimeout(timeoutId);
        }
    }

    // Method 3: Resilient State Update
    if (productsArray.length > 0) {
        app.state('products', productsArray);
    } else {
        console.warn('   ⚠️ All remote API calls failed. Keeping current or fallback data.');
    }

    app.state('is_loading', false);
    app.screen('Home', buildHomeScreen());
    app.patchScreen('Home');
});

// Category filtering handler
app.action('app:filter_category', async (action, value) => {
    // Extract category name if passed in colon format E.g. 'app:filter_category:Electronics'
    let cat = 'All';
    if (action.includes(':')) {
        cat = action.substring(action.lastIndexOf(':') + 1);
    } else if (value) {
        cat = String(value);
    }

    console.log(`🏷️ Filtering Category: ${cat}`);
    app.state('selected_category', cat);
    app.screen('Home', buildHomeScreen());
    app.patchScreen('Home');
});

// Add to Cart
app.action('app:add_to_cart', async (action, value) => {
    let productId = null;
    if (action.includes(':')) {
        productId = parseInt(action.substring(action.lastIndexOf(':') + 1), 10);
    } else if (value) {
        productId = parseInt(value, 10);
    }

    if (!productId) return;

    const products = app.getState('products') || [];
    const cart = app.getState('cart') || [];
    const product = products.find(p => p.id === productId);

    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity = (cartItem.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        // Recalculate total item count
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        app.state('cart', cart);
        app.state('cart_count', totalItems);

        console.log(`🛒 Cart Updated: Added product ${product.title}. Count: ${totalItems}`);

        // Patch screens to update Cart badge and Cart screen instantly
        app.screen('Home', buildHomeScreen());
        app.screen('Details', buildDetailsScreen());
        app.screen('Cart', buildCartScreen());
        app.patchScreen(app.getCurrentScreen() || 'Home');
    }
});

// Remove from Cart
app.action('app:remove_from_cart', async (action, value) => {
    let productId = null;
    if (action.includes(':')) {
        productId = parseInt(action.substring(action.lastIndexOf(':') + 1), 10);
    } else if (value) {
        productId = parseInt(value, 10);
    }

    if (!productId) return;

    const cart = app.getState('cart') || [];
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            const index = cart.indexOf(cartItem);
            if (index > -1) cart.splice(index, 1);
        }

        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        app.state('cart', cart);
        app.state('cart_count', totalItems);

        console.log(`🛒 Cart Updated: Removed product. Count: ${totalItems}`);

        app.screen('Home', buildHomeScreen());
        app.screen('Details', buildDetailsScreen());
        app.screen('Cart', buildCartScreen());
        app.patchScreen(app.getCurrentScreen() || 'Home');
    }
});

// Clear Cart
app.action('app:clear_cart', async () => {
    console.log('🧹 Clearing Cart...');
    app.state('cart', []);
    app.state('cart_count', 0);

    app.screen('Home', buildHomeScreen());
    app.screen('Details', buildDetailsScreen());
    app.screen('Cart', buildCartScreen());
    app.patchScreen('Cart');
});

// Simulated Checkout
app.action('app:checkout', async () => {
    console.log('💳 Checkout initiated!');
    app.state('cart', []);
    app.state('cart_count', 0);

    app.screen('Home', buildHomeScreen());
    app.screen('Details', buildDetailsScreen());
    app.screen('Cart', buildCartScreen());
    app.patchScreen('Cart');
});

// eSewa / Bank Style Quick Action Handler
app.action('app:quick_action', async (action) => {
    const rawService = action.slice(17); // e.g. "load_wallet"
    const serviceName = rawService.replace('_', ' ').toUpperCase();
    console.log(`🚀 Quick action clicked: ${serviceName}`);
    
    // Nepali localized messages
    const nepaliMessages = {
        'load_wallet': '💳 Wallet मा पैसा लोड गर्ने विकल्प छानियो!',
        'send_money': '💸 पैसा पठाउने (Send Money) सेवा सुरु भयो!',
        'bank_transfer': '🏦 बैंक ट्रान्सफर (Bank Transfer) सेवा सुरु भयो!',
        'top_up': '📱 मोबाइल टप-अप (Top Up) को लागि नम्बर राख्नुहोस्!',
        'electricity': '⚡ बिजुलीको महसुल भुक्तानी विन्डो खुल्यो!',
        'khanepani': '💧 खानेपानी महसुल भुक्तानी विकल्प रोजियो!',
        'govt_payment': '🏛️ सरकारी सेवा भुक्तानी (Govt Payment) सुरु भयो!',
        'tv_bills': '📺 टिभी रिचार्ज (TV Recharge) विकल्प चयन गरियो!',
        'all_services': '✨ सबै सेवाहरूको सूची लोड हुँदैछ...'
    };
    
    const msg = nepaliMessages[rawService] || `🚀 Service: ${serviceName}`;
    app.state('quick_message', msg);
    
    // Re-render home screen and patch it
    app.screen('Home', buildHomeScreen());
    app.patchScreen('Home');
});

// Clear Quick Action Message
app.action('app:clear_quick_message', async () => {
    app.state('quick_message', '');
    app.screen('Home', buildHomeScreen());
    app.patchScreen('Home');
});

// Native Flashlight simulation
app.action('TOGGLE_FLASH', async () => {
    console.log('💡 Native Flashlight action triggered!');
});

// Wildcard routing handler
app.action('nav:*', async (action) => {
    const rawPath = action.slice(4); // e.g. "Details?id=3" or "back"
    const screenName = rawPath.split('?')[0];

    console.log(`🔄 Navigation Action to: ${screenName} (Path: ${rawPath})`);

    if (screenName === 'back') {
        app.navigate('Home');
        return;
    }

    if (screenName === 'Details') {
        // Parse ID from Query String
        const idPart = rawPath.split('?')[1];
        if (idPart && idPart.startsWith('id=')) {
            const productId = parseInt(idPart.split('=')[1], 10);
            const products = app.getState('products') || [];
            const product = products.find(p => p.id === productId);
            if (product) {
                app.state('selected_product', product);
                app.screen('Details', buildDetailsScreen());
            }
        }
    }

    app.navigate(screenName);
});

// Wildcard Drawer handler
app.action('drawer:*', async (action) => {
    const cmd = action.slice(7); // "open" or "close"
    console.log(`📂 Drawer command: ${cmd}`);
    if (cmd === 'open') {
        app.openDrawer('MainDrawer');
    }
});

// Export app instance (enables DevServer state sync and patch screen link)
module.exports = app;
