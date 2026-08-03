'use strict';

/**
 * DemoApp — HomeScreen
 *
 * The default landing screen for the Dolphin DemoApp.
 * Import: const { HomeScreen } = require('./pages');
 */

const { Image } = require('../../src/framework/DolphinFramework');
const { useProducts } = require('../hooks');
const { formatPrice, truncate } = require('../utils');

/**
 * Build the HomeScreen binary definition using rich JSX.
 * @returns {object} Dolphin screen JSX element
 */
function HomeScreen() {
    const { products } = useProducts();

    return (
        <div className="flex flex-col flex-1 bg-slate-100">
            {/* Custom Transparent Premium AppBar */}
            <div className="flex flex-row items-center bg-gradient-horiz-indigo-153-purple-153 px-4 pt-4 pb-4 shadow-md w-full">
                <div className="text-white font-extrabold text-xl tracking-wider">🐬 Dolphin Shop 🌊</div>
            </div>

            {/* Main Body */}
            <div className="flex-1 p-4 overflow-y-scroll scroll-y">
                {/* Hero Header Banner */}
                <div className="p-6 rounded-3xl shadow-xl flex flex-col justify-center bg-gradient-indigo-600-purple-800-45" style={{ height: 150 }}>
                    <span className="text-white text-2xl font-black">Summer Collection 2026</span>
                    <span className="text-indigo-200 text-sm mt-1">Get up to 50% off on premium products</span>
                </div>

                <div className="mt-4 mb-2">
                    <span className="text-slate-800 font-extrabold text-lg block">{products.length} Products Available</span>
                </div>

                {/* Featured Products Grid */}
                <div className="flex flex-col gap-4 mt-2">
                    {products.slice(0, 10).map(p => (
                        <div key={p.id} className="card bg-white p-4 rounded-3xl shadow-md border border-slate-100 flex flex-row items-center w-full">
                            <Image src={p.image} className="w-20 h-20 rounded-2xl mr-4" width={80} height={80} />
                            <div className="flex-1 flex flex-col justify-between" style={{ height: 80 }}>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{p.category}</span>
                                    <span className="text-slate-800 font-bold text-sm mt-0.5">{truncate(p.title || p.name, 30)}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center w-full">
                                    <span className="text-indigo-600 font-black text-sm">{formatPrice(p.price)}</span>
                                    <button className="bg-gradient-horiz-indigo-153-purple-153 px-3 py-1.5 rounded-xl text-white text-xs font-black">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

module.exports = { HomeScreen };
