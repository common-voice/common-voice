import { Request, Response, NextFunction } from 'express'

import { FEATURES_COOKIE, FEATURES, Feature } from 'common'

// Checks feature flags from query string (first visit) and from cookie (successive visits)
export class RequireFeatureMiddleware {
  static handle(required_feature: string) {
    return function (req: Request, res: Response, next: NextFunction) {
      const { feature } = req.query
      const features_cookie = req.cookies[FEATURES_COOKIE]
      const features = features_cookie?.split(',') || []
      if (
        features.includes(required_feature) ||
        (feature &&
          feature === required_feature &&
          FEATURES.includes(feature as Feature))
      ) {
        next()
      } else {
        return res
          .status(401)
          .json({ message: 'Access to this feature is restricted:!' })
      }
    }
  }
}
