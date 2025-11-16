import { Request, Response, NextFunction } from 'express'

import { FEATURES_COOKIE, FEATURES, FEATURE_DAYS } from 'common'

// Checks feature flags from query string and saves them in cookie. Hendles cases:
// ?feature=feat1&feature=feat2 - Express array format
// ?feature=feat1,feat2 - Comma-separated string format
// ?feature=feat1 - Single feature
// ?feature=-feat1 - remove feature

export class HandleFeatureMiddleware {
  public handle = (req: Request, res: Response, next: NextFunction) => {
    const queryFeatures = req.query.feature

    // Always get array of non-empty strings
    const requested: string[] = (
      typeof queryFeatures === 'string'
        ? [queryFeatures]
        : Array.isArray(queryFeatures)
        ? queryFeatures.filter((f): f is string => typeof f === 'string')
        : []
    ).filter(f => f.length > 0)

    // Filter valid additions
    const additions = requested
      .filter(f => !f.startsWith('-'))
      .filter(f => FEATURES.includes(f))

    // Filter valid removals
    const removals = requested
      .filter(f => f.startsWith('-'))
      .map(f => f.slice(1))
      .filter(f => FEATURES.includes(f))

    // Read current cookie
    const cookieValue = req.cookies?.[FEATURES_COOKIE]
    const current: string[] =
      typeof cookieValue === 'string' && cookieValue.length > 0
        ? cookieValue.split(',')
        : []

    // Remove items
    let merged = current.filter(f => !removals.includes(f))

    // Add new items (avoid duplicates)
    merged = [...merged, ...additions.filter(f => !merged.includes(f))]

    // If nothing to change, next
    if (additions.length === 0 && removals.length === 0) {
      return next()
    }

    // Write updated cookie
    res.cookie(FEATURES_COOKIE, merged.join(','), {
      maxAge: 1000 * 60 * 60 * 24 * FEATURE_DAYS,
      httpOnly: false,
      sameSite: 'lax',
    })

    next()
  }
}
