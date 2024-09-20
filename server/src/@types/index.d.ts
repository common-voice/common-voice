declare global {
  interface String {
    includes(val: string): boolean
    startsWith(val: string): boolean
  }

  namespace Express {
    export interface User {
      emails?: any
      enrollment?: any
    }
    export interface Request {
      client_id?: string
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId: string
    codeVerifier: string
    passport: {
      user: any
    }
  }
}

export {}
