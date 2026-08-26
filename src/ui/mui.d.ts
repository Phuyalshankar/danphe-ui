// 🌊 Dolphin Native — Material UI (MUI) TypeScript Declarations
import * as React from 'react';

export interface TypographyProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button';
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface CardProps {
    elevation?: number;
    className?: string;
    children?: React.ReactNode;
}

export interface ButtonProps {
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    action?: string;
    onClick?: any;
    className?: string;
    children?: React.ReactNode;
}

export interface TextFieldProps {
    label?: string;
    type?: string;
    placeholder?: string;
    variant?: 'outlined' | 'filled' | 'standard';
    fullWidth?: boolean;
    value?: any;
    action?: string;
    className?: string;
}

export interface TableProps {
    className?: string;
    children?: React.ReactNode;
}

export interface TableCellProps {
    align?: 'left' | 'center' | 'right' | 'justify';
    className?: string;
    children?: React.ReactNode;
}

export interface GridProps {
    container?: boolean;
    item?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export interface BottomNavigationProps {
    target?: 'mobile' | 'web' | string;
    className?: string;
    children?: React.ReactNode;
}

export interface BottomNavigationActionProps {
    label?: string;
    icon?: React.ReactNode;
    action?: string;
    active?: boolean;
    className?: string;
}

export const Typography: React.FC<TypographyProps>;
export const Card: React.FC<CardProps>;
export const Button: React.FC<ButtonProps>;
export const TextField: React.FC<TextFieldProps>;
export const TableContainer: React.FC<TableProps>;
export const Table: React.FC<TableProps>;
export const TableHead: React.FC<TableProps>;
export const TableBody: React.FC<TableProps>;
export const TableRow: React.FC<TableProps>;
export const TableCell: React.FC<TableCellProps>;
export const Paper: React.FC<CardProps>;
export const Box: React.FC<TableProps>;
export const Grid: React.FC<GridProps>;
export const BottomNavigation: React.FC<BottomNavigationProps>;
export const BottomNavigationAction: React.FC<BottomNavigationActionProps>;
export const TabBar: React.FC<{ active?: string; target?: string }>;
