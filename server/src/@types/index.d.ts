declare global {
  interface String {
    includes(val: string): boolean
    startsWith(val: string): boolean
  }
}

declare module 'express-session' {
  interface SessionData {
    userId: string
    user: {
      client_id: string
      email: string
      enrollment?: any
    }
    auth: {
      state: string
    }
  }
}

export {}
