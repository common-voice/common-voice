import fetch from 'node-fetch';

import Logger from './logger';
import { getConfig } from '../config-helper';

const logger = new Logger({ name: 'GoogleReCAPTCHA' });

const SCORE_THRESHOLD = 0.5;
const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

/**
 * See docs/google-recaptcha.md for more info
 *
 * https://developers.google.com/recaptcha/docs/verify
 */
class GoogleReCAPTCHA {
  private reportErrors(json: { 'error-codes'?: string[] }) {
    const errorCodes = json['error-codes'];
    if (errorCodes) {
      logger.error(
        errorCodes,
        'https://developers.google.com/recaptcha/docs/verify#error_code_reference'
      );
    }
  }

  /**
   * reCAPTCHA v3 returns a score from 0.0 to 1.0
   * https://developers.google.com/recaptcha/docs/v3#interpreting_the_score
   */
  private verifyReCAPTCHAScore(score: number) {
    const { PROD } = getConfig();

    if (!score) {
      return false;
    }

    // skip score check outside of production
    if (!PROD) {
      return true;
    }

    return score >= SCORE_THRESHOLD;
  }

  private async sendRequest(reCAPTCHAClientResponse: string) {
    const { GOOGLE_RECAPTCHA_SECRET_KEY } = getConfig();

    const params = new URLSearchParams({
      secret: GOOGLE_RECAPTCHA_SECRET_KEY,
      response: reCAPTCHAClientResponse,
    });
    const url = new URL(`${VERIFY_URL}?${params}`);

    try {
      const fetchResponse = await fetch(url, { method: 'POST' });
      const json = await fetchResponse.json();
      return json;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async verify(reCAPTCHAClientResponse: string) {
    if (!reCAPTCHAClientResponse) {
      return false;
    }

    const json = await this.sendRequest(reCAPTCHAClientResponse);
    if (!json) {
      return false;
    }

    this.reportErrors(json);

    const validScore = this.verifyReCAPTCHAScore(json?.score);
    if (!validScore) {
      return false;
    }

    return json?.success;
  }
}

export default GoogleReCAPTCHA;
