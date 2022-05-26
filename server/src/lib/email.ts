import * as nodemailer from 'nodemailer';
import * as AWS from '@aws-sdk/client-ses';

import { getConfig } from '../config-helper';

/**
 * See docs/email.md for more info
 */
class Email {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter;

    this.createTransporter();
  }

  private async createTransporter() {
    const { PROD } = getConfig();

    if (!PROD) {
      this.transporter = await this.createTestTransporter();
      return;
    }

    this.transporter = this.createAWSTransporter();
  }

  private createAWSTransporter() {
    const { AWS_REGION, AWS_SES_CONFIG } = getConfig();

    const ses = new AWS.SES({
      apiVersion: '2010-12-01',
      region: AWS_REGION,
      ...AWS_SES_CONFIG,
    });

    return nodemailer.createTransport({
      SES: { ses, aws: AWS },
      sendingRate: 1, // message per second throttling
    });
  }

  private async createTestTransporter() {
    // uses ethereal.email - doesn't send an actual email anywhere
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  private async waitTilIdle(): Promise<void> {
    return new Promise(resolve => {
      if (this.transporter.isIdle()) {
        return resolve();
      }

      this.transporter.once('idle', () => {
        if (this.transporter.isIdle()) {
          resolve();
        }
      });
    });
  }

  private async send({ subject, html }: { subject: string; html: string }) {
    const { EMAIL_USERNAME_FROM, EMAIL_USERNAME_TO, PROD } = getConfig();

    if (PROD) {
      await this.waitTilIdle();
    }

    const info = await this.transporter.sendMail({
      from: EMAIL_USERNAME_FROM,
      to: EMAIL_USERNAME_TO,
      subject,
      html,
    });

    if (!PROD) {
      const emailPreviewUrl = nodemailer.getTestMessageUrl(info);
      console.info('📧 Email preview URL: ', emailPreviewUrl);
      info.emailPreviewURL = emailPreviewUrl;
    }

    return info;
  }

  private createSubject(email: string, languageLocale?: string) {
    return `Language Request ${email} ${languageLocale || ''}`.trim();
  }

  private createHTML(
    email: string,
    languageInfo: string,
    languageLocale?: string
  ) {
    let html = `
      <h2>Email</h2>
      <p><a href="mailto:${email}">${email}</a></p>
      <h2>Language Information</h2>
      <p>${languageInfo}</p>
    `.trim();

    if (languageLocale) {
      html += `
        <h2>Language Locale</h2>
        <p>${languageLocale}</p>
      `.trim();
    }

    return html.trim();
  }

  async sendLanguageRequestEmail({
    email,
    languageInfo,
    languageLocale,
  }: {
    email: string;
    languageInfo: string;
    languageLocale?: string;
  }) {
    const subject = this.createSubject(email, languageLocale);
    const html = this.createHTML(email, languageInfo, languageLocale);
    return this.send({ subject, html });
  }
}

export default Email;
