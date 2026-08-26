'use strict';

/**
 * 🇳🇵 NEPAL FLAG (danphe-ui)
 * Constitutional Mathematical Precision Vector Architecture with 120 FPS GPU Wind Flutter Animation.
 * Colors: Crimson Red (#C8102E), Deep Royal Blue Border (#003893), Pure White Emblems (#FFFFFF).
 */

const NEPAL_FLAG_CSS = `
@keyframes nepal-flag-flutter {
    0% {
        transform: rotate(0deg) skewY(0deg);
        filter: drop-shadow(0 0 15px rgba(200, 16, 46, 0.4)) drop-shadow(0 0 25px rgba(0, 56, 147, 0.3));
    }
    25% {
        transform: rotate(-1.5deg) skewY(1.2deg) scaleX(0.98);
        filter: drop-shadow(4px 4px 20px rgba(200, 16, 46, 0.6)) drop-shadow(0 0 30px rgba(34, 211, 238, 0.3));
    }
    50% {
        transform: rotate(1.2deg) skewY(-1.5deg) scaleX(1.02);
        filter: drop-shadow(-4px 4px 25px rgba(200, 16, 46, 0.5)) drop-shadow(0 0 35px rgba(0, 56, 147, 0.4));
    }
    75% {
        transform: rotate(-1deg) skewY(0.8deg) scaleX(0.99);
        filter: drop-shadow(2px 6px 20px rgba(200, 16, 46, 0.6));
    }
    100% {
        transform: rotate(0deg) skewY(0deg);
        filter: drop-shadow(0 0 15px rgba(200, 16, 46, 0.4)) drop-shadow(0 0 25px rgba(0, 56, 147, 0.3));
    }
}

@keyframes nepal-sun-glow {
    0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 3px #ffffff); }
    50% { transform: scale(1.08) rotate(15deg); filter: drop-shadow(0 0 10px #ffffff); }
}

@keyframes nepal-moon-breathe {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 3px #ffffff); }
    50% { transform: scale(1.06); filter: drop-shadow(0 0 8px #ffffff); }
}

.nepal-flag-animated {
    transform-origin: left center;
    animation: nepal-flag-flutter 3.2s ease-in-out infinite !important;
    display: inline-block;
}

.nepal-flag-sun {
    transform-origin: 26px 63px;
    animation: nepal-sun-glow 4s ease-in-out infinite !important;
}

.nepal-flag-moon {
    transform-origin: 26px 25px;
    animation: nepal-moon-breathe 3.5s ease-in-out infinite !important;
}
`;

/**
 * Render the Official National Flag of Nepal as Pure Vector SVG
 */
function renderNepalFlag({
    width = 48,
    height = 58,
    animated = true,
    shadow = true,
    className = ''
} = {}) {
    const animClass = animated ? 'nepal-flag-animated' : '';
    const sunAnimClass = animated ? 'nepal-flag-sun' : '';
    const moonAnimClass = animated ? 'nepal-flag-moon' : '';

    return `
<div class="nepal-flag-container inline-flex items-center justify-center ${className}">
    <svg xmlns="http://www.w3.org/2000/svg" 
         viewBox="0 0 70 85" 
         width="${width}" 
         height="${height}" 
         class="${animClass}">
        <defs>
            <style>${NEPAL_FLAG_CSS}</style>
            <!-- 3D Specular Lighting Filter -->
            <filter id="nepal-flag-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#c8102e" flood-opacity="0.35"/>
            </filter>
        </defs>

        <!-- 1. DEEP BLUE OUTER BORDER (#003893) -->
        <polygon points="0,0 60,38 24,38 68,85 0,85" 
                 fill="#003893" 
                 stroke="#003893" 
                 stroke-width="1.5"
                 stroke-linejoin="round"
                 stroke-linecap="round"/>

        <!-- 2. CRIMSON RED INNER FIELD (#C8102E) -->
        <polygon points="4,5 51,35 20,35 58,79 4,79" 
                 fill="#C8102E"/>

        <!-- 3. UPPER CRESCENT MOON & 8 RAYS (WHITE #FFFFFF) -->
        <g class="${moonAnimClass}">
            <!-- Crescent Moon Body -->
            <path d="M 16 28 C 16 35, 36 35, 36 28 C 33 32, 19 32, 16 28 Z" fill="#FFFFFF"/>
            <!-- Moon Center Circle -->
            <circle cx="26" cy="25" r="4.2" fill="#FFFFFF"/>
            <!-- 8 Moon Rays -->
            <polygon points="26,18 27.5,22 31,20 29.5,23.5 33,25 29.5,26.5 31,30 27.5,28 26,32 24.5,28 21,30 22.5,26.5 19,25 22.5,23.5 21,20 24.5,22" 
                     fill="#FFFFFF"/>
        </g>

        <!-- 4. LOWER 12-RAYED SUN (WHITE #FFFFFF) -->
        <g class="${sunAnimClass}">
            <!-- Central Sun Core -->
            <circle cx="26" cy="63" r="5.5" fill="#FFFFFF"/>
            <!-- 12 Sharp Triangular Rays -->
            <polygon points="26,50 28,56 34,52 32,58 39,57 35,62 40,65 34,67 36,73 31,71 30,77 26,73 22,77 21,71 16,73 18,67 12,65 17,62 13,57 20,58 18,52 24,56" 
                     fill="#FFFFFF"/>
        </g>
    </svg>
</div>`;
}

module.exports = {
    renderNepalFlag,
    NepalFlag: renderNepalFlag,
    NEPAL_FLAG_CSS
};
