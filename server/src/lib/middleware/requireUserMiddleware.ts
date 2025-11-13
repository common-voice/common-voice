import { Request, Response, NextFunction } from 'express'

export class RequireUserMiddleware {
  public handle(req: Request, res: Response, next: NextFunction) {
    if (!req.session?.user?.client_id) {
      return res.status(401).json({ message: 'no user' })
    }
    next()
  }
}
