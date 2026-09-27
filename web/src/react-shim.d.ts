declare module "react/jsx-runtime" {
  export const Fragment: unknown;
  export function jsx(...args: unknown[]): unknown;
  export function jsxs(...args: unknown[]): unknown;
}

declare module "react" {
  export function createElement(...args: unknown[]): unknown;
}

declare module "react-dom/server" {
  export function renderToStaticMarkup(element: unknown): string;
}

declare namespace JSX {
  interface IntrinsicElements { [elementName: string]: any; }
}
