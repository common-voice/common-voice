import { Request, Response, NextFunction } from 'express'
import * as jose from 'jose'
import { getConfig } from '../../../config-helper'

const getJwksUri = async (issuer: string) => {
  const response = await fetch(`${issuer}/.well-known/openid-configuration`)
  const { jwks_uri } = await response.json()
  return new URL(jwks_uri)
}

export const authenticateFxaEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Assuming this is how you retrieve your auth header.
  const authHeader = req.headers.authorization

  // Require an auth header
  if (!authHeader) {
    throw Error('No auth header found')
  }

  // Extract the first portion which should be 'Bearer'
  const headerType = authHeader.substr(0, authHeader.indexOf(' '))

  if (headerType !== 'Bearer') {
    throw Error('Invalid auth type')
  }

  // The remaining portion, which should be the token
  const headerToken = authHeader.substr(authHeader.indexOf(' ') + 1)

  // Decode the token, require it to come out ok as an object
  const token = jose.decodeJwt(headerToken)

  if (!token || typeof token === 'string') {
    throw Error('Invalid token type')
  }

  const jwksUri = await getJwksUri(getConfig().FXA.DOMAIN)
  const JWKS = jose.createRemoteJWKSet(jwksUri)

  const { payload, protectedHeader } = await jose.jwtVerify(headerToken, JWKS, {
    issuer: getConfig().FXA.DOMAIN,
  })

  req.eventToken = payload

  next()
}
