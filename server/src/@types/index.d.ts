declare global {
  interface String {
    includes(val: string): boolean;
    startsWith(val: string): boolean;
  }

  namespace Express {
    export interface Request {
      client_id?: string;
    }
  }
}

export {};
