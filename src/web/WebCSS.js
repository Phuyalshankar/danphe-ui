'use strict';

/**
 * 🎨 WebCSS v1.0 — High-Visibility 60 FPS CSS Motion Engine
 * Dramatic, High-Contrast Keyframe Animations & Micro-Interactions
 */
class WebCSS {
    static getBaseStyles() {
        return `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
            width: 100%; height: 100%; min-height: 100vh;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #020617; color: #f8fafc;
            -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
        }

        /* Sleek Cyberpunk Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #090d16; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 9999px; border: 2px solid #090d16; }
        ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }

        /* Explicit Rounded Border Radii */
        .rounded, .rounded-md { border-radius: 0.375rem !important; }
        .rounded-6, .rounded-8 { border-radius: 8px !important; }
        .rounded-lg, .rounded-10 { border-radius: 0.5rem !important; }
        .rounded-xl, .rounded-12 { border-radius: 0.75rem !important; }
        .rounded-14, .rounded-16, .rounded-2xl { border-radius: 1rem !important; }
        .rounded-20, .rounded-24, .rounded-3xl { border-radius: 1.5rem !important; }
        .rounded-32 { border-radius: 2rem !important; }
        .rounded-full { border-radius: 9999px !important; }

        /* Web Slide-Over Drawer Rules */
        #dolphin-web-drawer { transform: translateX(-100%) !important; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important; }
        #dolphin-web-drawer.drawer-open { transform: translateX(0) !important; }
        #dolphin-web-drawer-backdrop { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.3s ease !important; }
        #dolphin-web-drawer-backdrop.drawer-open { opacity: 1 !important; pointer-events: auto !important; }

        /* Glassmorphism Cards & Containers */
        .bg-slate-900 {
            background-color: rgba(15, 23, 42, 0.92) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(51, 65, 85, 0.6) !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5) !important;
        }

        /* Responsive Images & Video Sizing */
        img, video { max-width: 100% !important; height: auto; object-fit: cover; border-radius: 0.75rem; }
        .max-w-xs { max-width: 20rem !important; }
        .max-w-sm { max-width: 24rem !important; }
        .max-w-md { max-width: 28rem !important; }
        .max-w-lg { max-width: 32rem !important; }
        .max-w-xl { max-width: 36rem !important; }
        .max-w-2xl { max-width: 42rem !important; }
        .max-w-3xl { max-width: 48rem !important; }
        .max-w-4xl { max-width: 56rem !important; }
        .max-w-5xl { max-width: 64rem !important; }
        .max-w-6xl { max-width: 72rem !important; }
        .max-w-7xl { max-width: 80rem !important; }
        .mx-auto { margin-left: auto !important; margin-right: auto !important; }
        .w-48 { width: 12rem !important; }
        .w-64 { width: 16rem !important; }
        .w-80 { width: 20rem !important; }
        .w-96 { width: 24rem !important; }
        .h-48 { height: 12rem !important; }
        .h-64 { height: 16rem !important; }
        .h-80 { height: 20rem !important; }
        .h-96 { height: 24rem !important; }
        
        /* Floating Label & Form Styles */
        .floatinglabel-input, .form-floating .form-control, .floatinglabel input {
            width: 100% !important; min-height: 3.5rem !important; padding: 1.25rem 1rem 0.35rem 1rem !important; font-size: 1rem !important; border-radius: 0.75rem !important; box-sizing: border-box !important;
        }
        .floatinglabel-input.lg { min-height: 4rem !important; padding-top: 1.5rem !important; }
        .floatinglabel-label, .form-floating label {
            position: absolute !important; left: 0.85rem !important; top: 50% !important; transform: translateY(-50%) !important; pointer-events: none !important; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; transform-origin: 0 0 !important; margin: 0 !important; padding: 0 4px !important; border-radius: 4px !important; line-height: 1 !important;
        }

        /* Layout Helpers */
        .flex { display: flex; }
        .flex-row { display: flex !important; flex-direction: row !important; }
        .flex-col, .flex-column { display: flex !important; flex-direction: column !important; }
        .flex-col-center { display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; }
        .flex-row-center { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: center !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .justify-between { justify-content: space-between !important; }
        .flex-1 { flex: 1 1 0% !important; align-self: stretch !important; }
        .w-full { width: 100% !important; align-self: stretch !important; }
        .scrollable { overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; }

        /* Grid & Spacing */
        .grid { display: grid !important; }
        .grid-cols-1 { display: grid !important; grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        .grid-cols-2 { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .grid-cols-3 { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .grid-cols-4 { display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
        .gap-2 { gap: 8px !important; }
        .gap-3 { gap: 12px !important; }
        .gap-4 { gap: 16px !important; }
        .gap-6 { gap: 24px !important; }
        .gap-8 { gap: 32px !important; }

        /* 🎬 ---- HIGH-VISIBILITY 60 FPS KEYFRAME ANIMATIONS ---- */
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ping { 75%, 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.03); } }
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 20% { transform: scale(1.08); } 40% { transform: scale(0.96); } 60% { transform: scale(1.06); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes tada { 0% { transform: scale(1) rotate(0deg); } 10%, 20% { transform: scale(0.9) rotate(-4deg); } 30%, 50%, 70%, 90% { transform: scale(1.12) rotate(4deg); } 40%, 60%, 80% { transform: scale(1.12) rotate(-4deg); } 100% { transform: scale(1) rotate(0deg); } }
        @keyframes headshake { 0% { transform: translateX(0); } 13% { transform: translateX(-10px) rotate(-3deg); } 37% { transform: translateX(8px) rotate(3deg); } 63% { transform: translateX(-5px) rotate(-2deg); } 87% { transform: translateX(3px) rotate(1deg); } 100% { transform: translateX(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes rotateIn { from { opacity: 0; transform: rotate(-180deg) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); } }
        @keyframes flip { 0% { transform: perspective(600px) rotateY(0deg); } 50% { transform: perspective(600px) rotateY(180deg); } 100% { transform: perspective(600px) rotateY(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(217, 70, 239, 0.3); } 50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(217, 70, 239, 0.9); } }

        /* Animation Utility Class Rules */
        .animate-spin { animation: spin 1s linear infinite !important; will-change: transform; }
        .animate-ping { animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite !important; will-change: transform; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; will-change: transform, opacity; }
        .animate-heartbeat { animation: heartbeat 1.4s ease-in-out infinite !important; will-change: transform; }
        .animate-bounce { animation: bounce 1.2s ease-in-out infinite !important; will-change: transform; }
        .animate-tada { animation: tada 1.5s ease-in-out infinite !important; will-change: transform; }
        .animate-headshake { animation: headshake 1.8s ease-in-out infinite !important; will-change: transform; }
        .animate-slide-up, .slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; will-change: transform, opacity; }
        .animate-slide-down, .slide-down { animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; will-change: transform, opacity; }
        .animate-slide-left, .slide-left { animation: slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; will-change: transform, opacity; }
        .animate-slide-right, .slide-right { animation: slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; will-change: transform, opacity; }
        .animate-zoom-in, .zoom-in { animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important; will-change: transform, opacity; }
        .animate-rotate-in { animation: rotateIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important; will-change: transform, opacity; }
        .animate-flip { animation: flip 3s linear infinite !important; will-change: transform; }
        .animate-shimmer { background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%); background-size: 200% 100%; animation: shimmer 2s infinite !important; }
        .animate-float { animation: float 3s ease-in-out infinite !important; will-change: transform; }
        .animate-breathe { animation: breathe 3s ease-in-out infinite !important; will-change: transform, box-shadow; }
        .framer-spring { animation: zoomIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards !important; will-change: transform, opacity; }
        .framer-bounce { animation: bounce 1.2s ease-in-out infinite !important; will-change: transform; }

        /* Micro-Interactions & Hover Lift */
        .transition, .transition-all { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        .duration-200 { transition-duration: 200ms !important; }
        .duration-300 { transition-duration: 300ms !important; }
        .duration-500 { transition-duration: 500ms !important; }
        button, a, [data-action] { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; cursor: pointer; }
        button:hover, a:hover, [data-action]:hover {
            transform: translateY(-2px) scale(1.01) !important;
            filter: brightness(1.15) !important;
            box-shadow: 0 12px 24px -6px rgba(59, 130, 246, 0.35) !important;
        }
        button:active, a:active, [data-action]:active { transform: translateY(0) scale(0.97) !important; }

        @media (min-width: 768px) {
            .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
            .md\:flex-row { display: flex !important; flex-direction: row !important; }
            .md\:p-8 { padding: 32px !important; }
            .md\:text-5xl { font-size: 48px !important; line-height: 1 !important; }
        }
        `;
    }
}

module.exports = WebCSS;
