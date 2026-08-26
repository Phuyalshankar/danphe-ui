'use strict';

/**
 * 📐 FlexStyles — Dictionary of flexbox layout utilities (flex-col, flex-row, justify-between, items-center, flex-1).
 */
const FLEX_MAP = {
    'flex': ['display: flex;'],
    'flex-row': ['display: flex;', 'flex-direction: row;'],
    'flex-col': ['display: flex;', 'flex-direction: column;'],
    'flex-column': ['display: flex;', 'flex-direction: column;'],
    'flex-left': ['display: flex;', 'justify-content: flex-start;', 'align-items: center;'],
    'flex-right': ['display: flex;', 'justify-content: flex-end;', 'align-items: center;'],
    'flex-center': ['display: flex;', 'justify-content: center;', 'align-items: center;'],
    'flex-between': ['display: flex;', 'justify-content: space-between;', 'align-items: center;'],
    'flex-around': ['display: flex;', 'justify-content: space-around;', 'align-items: center;'],
    'flex-evenly': ['display: flex;', 'justify-content: space-evenly;', 'align-items: center;'],
    'flex-start': ['display: flex;', 'justify-content: flex-start;', 'align-items: flex-start;'],
    'flex-end': ['display: flex;', 'justify-content: flex-end;', 'align-items: flex-end;'],
    'flex-stretch': ['display: flex;', 'justify-content: center;', 'align-items: stretch;'],
    'flex-wrap': ['display: flex;', 'flex-wrap: wrap;'],
    'flex-nowrap': ['display: flex;', 'flex-wrap: nowrap;'],
    'flex-1': ['flex: 1 1 0%;'],
    'flex-auto': ['flex: 1 1 auto;'],
    'flex-none': ['flex: none;'],
    'flex-grow': ['flex-grow: 1;'],
    'flex-shrink': ['flex-shrink: 1;'],
    'items-center': ['align-items: center;'],
    'items-start': ['align-items: flex-start;'],
    'items-end': ['align-items: flex-end;'],
    'items-stretch': ['align-items: stretch;'],
    'justify-center': ['justify-content: center;'],
    'justify-start': ['justify-content: flex-start;'],
    'justify-end': ['justify-content: flex-end;'],
    'justify-between': ['justify-content: space-between;'],
    'justify-around': ['justify-content: space-around;'],
    'justify-evenly': ['justify-content: space-evenly;'],
    'row': ['display: flex;', 'flex-direction: row;'],
    'column': ['display: flex;', 'flex-direction: column;'],
};

module.exports = { FLEX_MAP };
