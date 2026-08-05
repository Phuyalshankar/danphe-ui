'use strict';

/**
 * 🔘 ButtonStyles — Component style presets for buttons (btn, btn-primary, btn-outline, etc.).
 */
const BUTTON_STYLES = {
    'btn': [
        'display: inline-flex;', 'align-items: center;', 'justify-content: center;',
        'padding: 10px 20px;', 'font-size: 14px;', 'font-weight: 500;',
        'border-radius: 8px;', 'cursor: pointer;',
        'transition: all 0.3s cubic-bezier(0.4,0,0.2,1);',
        'border: none;', 'outline: none;', 'gap: 8px;',
        'position: relative;', 'overflow: hidden;',
        'transform: translateY(0);',
        'box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
    ],
    'btn-sm': ['padding: 6px 12px;', 'font-size: 12px;', 'border-radius: 6px;'],
    'btn-md': ['padding: 10px 20px;', 'font-size: 14px;', 'border-radius: 8px;'],
    'btn-lg': ['padding: 14px 28px;', 'font-size: 16px;', 'border-radius: 10px;'],
    'btn-primary': ['background: linear-gradient(135deg, #3b82f6, #2563eb);', 'color: white;'],
    'btn-secondary': ['background: linear-gradient(135deg, #6b7280, #4b5563);', 'color: white;'],
    'btn-success': ['background: linear-gradient(135deg, #10b981, #059669);', 'color: white;'],
    'btn-danger': ['background: linear-gradient(135deg, #ef4444, #dc2626);', 'color: white;'],
    'btn-warning': ['background: linear-gradient(135deg, #f59e0b, #d97706);', 'color: white;'],
    'btn-info': ['background: linear-gradient(135deg, #06b6d4, #0891b2);', 'color: white;'],
    'btn-outline': ['background: transparent;', 'border: 2px solid;'],
    'btn-ghost': ['background: transparent;', 'box-shadow: none;'],
};

module.exports = { BUTTON_STYLES };
