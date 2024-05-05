// global.d.ts
declare global {
    interface Window {
      adsbygoogle: { [key: string]: unknown }[];
    }
  }
  
  export {};