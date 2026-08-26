'use strict';

/**
 * Dolphin Native - Official Material UI (MUI) Component Aliases
 * Provides seamless 1-to-1 compatibility for official MUI React code syntax.
 */

// Typography Variant Mapping
const TYPOGRAPHY_VARIANTS = {
    'h1': 'text-3xl font-black',
    'h2': 'text-2xl font-black',
    'h3': 'text-xl font-bold',
    'h4': 'text-lg font-bold',
    'h5': 'text-base font-extrabold',
    'h6': 'text-sm font-bold',
    'subtitle1': 'text-sm text-slate-500 font-medium',
    'subtitle2': 'text-xs text-slate-400 font-medium',
    'body1': 'text-sm text-slate-700',
    'body2': 'text-xs text-slate-600',
    'caption': 'text-[10px] text-slate-400',
    'button': 'text-xs font-bold uppercase tracking-wider'
};

// Alignment Mapping
const ALIGN_MAP = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
    'justify': 'text-justify'
};

// Button Color Mapping
const BUTTON_COLORS = {
    'primary': 'bg-indigo-600 text-white hover:bg-indigo-700',
    'secondary': 'bg-purple-600 text-white hover:bg-purple-700',
    'success': 'bg-emerald-600 text-white hover:bg-emerald-700',
    'error': 'bg-rose-600 text-white hover:bg-rose-700',
    'warning': 'bg-amber-500 text-white hover:bg-amber-600',
    'info': 'bg-cyan-600 text-white hover:bg-cyan-700'
};

/**
 * MUI Typography
 */
const Typography = (props) => {
    const variantClass = TYPOGRAPHY_VARIANTS[props.variant] || TYPOGRAPHY_VARIANTS['body1'];
    const alignClass = ALIGN_MAP[props.align] || '';
    const colorClass = props.color ? `text-${props.color}` : '';
    return (
        <span className={`MuiTypography-root ${variantClass} ${alignClass} ${colorClass} ${props.className || ''}`}>
            {props.children}
        </span>
    );
};

/**
 * MUI Card
 */
const Card = (props) => {
    const elev = props.elevation || 2;
    const shadowClass = elev >= 4 ? 'shadow-lg' : elev >= 2 ? 'shadow-md' : 'shadow-sm';
    return (
        <div className={`MuiCard-root MuiPaper-root bg-white rounded-2xl ${shadowClass} border border-slate-200 ${props.className || ''}`}>
            {props.children}
        </div>
    );
};

/**
 * MUI Button
 */
const Button = (props) => {
    const colorStyle = BUTTON_COLORS[props.color || 'primary'] || BUTTON_COLORS['primary'];
    const variantStyle = props.variant === 'outlined' 
        ? 'border-2 border-indigo-600 text-indigo-600 bg-transparent' 
        : props.variant === 'text' 
        ? 'bg-transparent text-indigo-600 shadow-none' 
        : colorStyle;

    const fullWidthStyle = props.fullWidth ? 'w-full' : '';

    return (
        <button 
            action={props.action || props.onClick} 
            className={`MuiButton-root MuiButton-contained btn ${variantStyle} ${fullWidthStyle} p-3 rounded-xl font-bold text-xs shadow-sm flex-row items-center justify-center ${props.className || ''}`}
        >
            {props.children}
        </button>
    );
};

/**
 * MUI TextField
 */
const TextField = (props) => {
    const fullWidthClass = props.fullWidth ? 'w-full' : '';
    return (
        <div className={`MuiTextField-root flex-column gap-1.5 ${fullWidthClass} ${props.className || ''}`}>
            {props.label && <span className="text-xs font-bold text-slate-700">{props.label}</span>}
            <input 
                type={props.type || 'text'} 
                placeholder={props.placeholder || props.label || ''} 
                value={props.value} 
                action={props.action} 
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm focus:border-indigo-600 shadow-sm"
            />
        </div>
    );
};

/**
 * MUI Table Components
 */
const TableContainer = (props) => (
    <div className={`MuiTableContainer-root MuiPaper-root bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-column ${props.className || ''}`}>
        {props.children}
    </div>
);

const Table = (props) => (
    <div className={`MuiTable-root w-full flex-column ${props.className || ''}`}>
        {props.children}
    </div>
);

const TableHead = (props) => (
    <div className={`MuiTableHead-root bg-slate-50 border-b border-slate-200 px-3 py-3 flex-row items-center justify-between ${props.className || ''}`}>
        {props.children}
    </div>
);

const TableBody = (props) => (
    <div className={`MuiTableBody-root flex-column divide-y divide-slate-100 ${props.className || ''}`}>
        {props.children}
    </div>
);

const TableRow = (props) => (
    <div className={`MuiTableRow-root px-3 py-3 flex-row items-center justify-between hover:bg-slate-50 ${props.className || ''}`}>
        {props.children}
    </div>
);

const TableCell = (props) => {
    const alignClass = ALIGN_MAP[props.align] || '';
    return (
        <span className={`MuiTableCell-root flex-1 ${alignClass} ${props.className || ''}`}>
            {props.children}
        </span>
    );
};

const Paper = (props) => (
    <div className={`MuiPaper-root bg-white rounded-2xl shadow-md border border-slate-200 ${props.className || ''}`}>
        {props.children}
    </div>
);

const Box = (props) => (
    <div className={`MuiBox-root ${props.className || ''}`}>
        {props.children}
    </div>
);

const Grid = (props) => {
    const containerClass = props.container ? 'flex-row flex-wrap gap-3' : 'flex-1';
    return (
        <div className={`MuiGrid-root ${containerClass} ${props.className || ''}`}>
            {props.children}
        </div>
    );
};

/**
 * MUI Bottom Navigation
 */
const BottomNavigation = (props) => (
    <div target={props.target} className={`MuiBottomNavigation-root fixed bottom-3 left-3 right-3 bg-white border border-slate-200/80 px-2 py-2 flex-row items-center overflow-x-auto gap-2 rounded-2xl shadow-xl z-50 ${props.className || ''}`}>
        {props.children}
    </div>
);

const BottomNavigationAction = (props) => (
    <button 
        action={props.action || props.onClick} 
        className={`MuiBottomNavigationAction-root flex-column items-center justify-center min-w-[76px] px-3 py-2 mx-1 gap-1 border-none rounded-xl bg-transparent ${props.active ? 'bg-indigo-100 text-indigo-700 font-black shadow-sm' : 'text-slate-500 font-medium'} ${props.className || ''}`}
    >
        {props.icon && <span className="text-lg">{props.icon}</span>}
        <span className="text-[10px]">{props.label}</span>
    </button>
);

/**
 * Built-in TabBar Component
 */
const TabBar = (props) => (
    <div target={props.target || ''} className={`MuiTabBar-root fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex-row items-center justify-between shadow-lg z-50 ${props.className || ''}`}>
        <button action="nav:Home" className={`flex-column items-center flex-1 gap-1 border-none bg-transparent ${props.active === 'Home' || !props.active ? 'text-indigo-600 font-extrabold' : 'text-slate-400 font-medium'}`}>
            <span className="text-lg">🏠</span>
            <span className="text-[10px]">Home</span>
        </button>

        <button action="nav:Form" className={`flex-column items-center flex-1 gap-1 border-none bg-transparent ${props.active === 'Form' ? 'text-indigo-600 font-extrabold' : 'text-slate-400 font-medium'}`}>
            <span className="text-lg">📝</span>
            <span className="text-[10px]">Form</span>
        </button>

        <button action="nav:Products" className={`flex-column items-center flex-1 gap-1 border-none bg-transparent ${props.active === 'Products' ? 'text-indigo-600 font-extrabold' : 'text-slate-400 font-medium'}`}>
            <span className="text-lg">📦</span>
            <span className="text-[10px]">Products</span>
        </button>

        <button action="nav:Settings" className={`flex-column items-center flex-1 gap-1 border-none bg-transparent ${props.active === 'Settings' ? 'text-indigo-600 font-extrabold' : 'text-slate-400 font-medium'}`}>
            <span className="text-lg">⚙️</span>
            <span className="text-[10px]">Settings</span>
        </button>
    </div>
);

module.exports = {
    Typography,
    Card,
    Button,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Box,
    Grid,
    BottomNavigation,
    BottomNavigationAction,
    TabBar
};
