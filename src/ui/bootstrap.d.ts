// 🌊 Dolphin Native — Bootstrap UI TypeScript Declarations
import * as React from 'react';

export interface BootstrapContainerProps {
    fluid?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export interface BootstrapRowProps {
    className?: string;
    children?: React.ReactNode;
}

export interface BootstrapColProps {
    xs?: number;
    md?: number;
    lg?: number;
    className?: string;
    children?: React.ReactNode;
}

export interface BootstrapButtonProps {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
    size?: 'sm' | 'lg';
    action?: string;
    onClick?: any;
    className?: string;
    children?: React.ReactNode;
}

export interface BootstrapTableProps {
    striped?: boolean;
    hover?: boolean;
    bordered?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const Container: React.FC<BootstrapContainerProps>;
export const Row: React.FC<BootstrapRowProps>;
export const Col: React.FC<BootstrapColProps>;
export const Card: React.FC<{ className?: string; children?: React.ReactNode }> & {
    Body: React.FC<{ className?: string; children?: React.ReactNode }>;
    Title: React.FC<{ className?: string; children?: React.ReactNode }>;
};
export const Button: React.FC<BootstrapButtonProps>;
export const Table: React.FC<BootstrapTableProps>;
export const Form: React.FC<{ onSubmit?: any; className?: string; children?: React.ReactNode }> & {
    Group: React.FC<{ className?: string; children?: React.ReactNode }>;
    Label: React.FC<{ className?: string; children?: React.ReactNode }>;
    Control: React.FC<{ type?: string; placeholder?: string; value?: any; className?: string }>;
};
export const Navbar: React.FC<{ className?: string; children?: React.ReactNode }> & {
    Brand: React.FC<{ href?: string; className?: string; children?: React.ReactNode }>;
};
