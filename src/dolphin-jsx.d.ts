import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      type?: string;
      target?: string;
      action?: string;
      stateKey?: string;
      statekey?: string;
      columns?: number;
      gap?: number;
      scrollable?: boolean;
      icon?: string;
      iconLeft?: string;
      iconRight?: string;
    }

    interface HTMLAttributes<T> extends React.DOMAttributes<T> {
      type?: string;
      target?: string;
      action?: string;
      stateKey?: string;
      statekey?: string;
      columns?: number;
      gap?: number;
      scrollable?: boolean;
      icon?: string;
      iconLeft?: string;
      iconRight?: string;
    }

    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
