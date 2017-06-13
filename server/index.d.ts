declare global {
  interface String {
    includes(val: string): boolean;
    startsWith(val: string): boolean;
  }
}

export {};
