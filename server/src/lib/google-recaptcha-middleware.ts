import { NextFunction, Request, Response } from 'express';

import { APIError } from './utility';
import GoogleReCAPTCHA from './google-recaptcha';

async function validateGoogleReCAPTCHA(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const { reCAPTCHAClientResponse } = request.body;

  if (!reCAPTCHAClientResponse) {
    next(
      new APIError(
        '[reCAPTCHA] Missing reCAPTCHAClientResponse in request body'
      )
    );
    return;
  }

  const googleReCAPTCHA = new GoogleReCAPTCHA();
  const isSuccessfulReCAPTCHA = await googleReCAPTCHA.verify(
    reCAPTCHAClientResponse
  );

  if (isSuccessfulReCAPTCHA) {
    next();
    return;
  }

  next(new APIError('[reCAPTCHA] Something went wrong with reCAPTCHA'));
}

export default validateGoogleReCAPTCHA;
