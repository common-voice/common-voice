import { Request, Response, NextFunction } from 'express'

import { FEATURES_COOKIE, FEATURES, FEATURE_DAYS } from 'common'

// Checks feature flags from query string and saves them in cookie
export class HandleFeatureMiddleware {
  public handle(req: Request, res: Response, next: NextFunction) {
    const { feature } = req.query
    if (!feature || !FEATURES.includes(feature as string)) {
      return next()
    }
    const enabled = req.cookies[FEATURES_COOKIE]
    const features = enabled?.split(',') || []
    if (!features.includes(feature)) {
      features.push(feature)
    }
    res.cookie(FEATURES_COOKIE, features.join(','), {
      maxAge: 1000 * 60 * 60 * 24 * 30 * FEATURE_DAYS, // X days
      httpOnly: false, // So JS can read it if needed
      sameSite: 'lax',
    })
    next()
  }
}
