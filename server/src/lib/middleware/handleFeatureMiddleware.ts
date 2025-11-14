import { Request, Response, NextFunction } from 'express'

import { FEATURES_COOKIE, FEATURES, FEATURE_DAYS } from 'common'

// Checks feature flags from query string and saves them in cookie. Hendles cases:
// ?feature=feat1&feature=feat2 - Express array format
// ?feature=feat1,feat2 - Comma-separated string format
// ?feature=feat1 - Single feature

export class HandleFeatureMiddleware {
  // Use arrow function not to lose binding
  public handle = (req: Request, res: Response, next: NextFunction) => {
    const features = this.getValidFeaturesFromQuery(req.query.feature)

    if (features.length > 0) {
      const currentFeatures = this.getCurrentFeatures(req)
      const newFeatures = features.filter(f => !currentFeatures.includes(f))

      if (newFeatures.length > 0) {
        this.updateFeaturesCookie(res, [...currentFeatures, ...newFeatures])
      }
    }

    next()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getValidFeaturesFromQuery(feature: any): string[] {
    if (!feature) return []

    const features = Array.isArray(feature)
      ? feature.filter(f => typeof f === 'string')
      : String(feature)
          .split(',')
          .map(f => f.trim())

    return features.filter(f => FEATURES.includes(f))
  }

  private getCurrentFeatures(req: Request): string[] {
    const cookie = req.cookies[FEATURES_COOKIE]
    return cookie ? cookie.split(',').filter(Boolean) : []
  }

  private updateFeaturesCookie(res: Response, features: string[]): void {
    res.cookie(FEATURES_COOKIE, features.join(','), {
      maxAge: 1000 * 60 * 60 * 24 * FEATURE_DAYS,
      httpOnly: false,
      sameSite: 'lax',
    })
  }
}
