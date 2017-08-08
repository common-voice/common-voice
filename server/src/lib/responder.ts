import * as http from 'http';

/**
 * Holds information about server responses.
 */
export default class Responder {

  public static readonly CONTENT_TYPES = {
    TXT  : 'text/plain',
    HTML : 'text/html',
    JS   : 'text/javascript',
    CSS  : 'text/css',
    JSON : 'application/json',
    PNG  : 'image/png',
    JPG  : 'image/jpg',
    GIF  : 'image/gif',
    SVG  : 'image/svg+xml',
    WAV  : 'audio/wav',
    MP4  : 'video/mp4',
    WOFF : 'application/font-woff',
    TTF  : 'application/font-ttf',
    EOT  : 'application/vnd.ms-fontobject',
    OTF  : 'application/font-otf',
  };

  private response: http.ServerResponse;
  private headers: object;
  private contentType: string;
  private content: string;
  private characterEncoding: string;
  private statusCode: number;

  constructor(response: http.ServerResponse) {
    this.response = response;
    this.headers = {};
    this.contentType = Responder.CONTENT_TYPES.TXT;
    this.content = '';
    this.characterEncoding = 'utf-8';
    this.statusCode = 200;
  }

  addHeader(name: string, value: string): Responder {
    this.headers[name] = value;
    return this;
  }

  setContentType(contentType: string): Responder {
    this.contentType = contentType;
    return this;
  }

  setContent(content: string): Responder {
    this.content = content;
    return this;
  }

  setCharacterEncoding(characterEncoding: string): Responder {
    this.characterEncoding = characterEncoding;
    return this;
  }

  setStatusCode(statusCode: number): Responder {
    this.statusCode = statusCode;
    return this;
  }

  /**
   * Sends and ends the response.
   */
  send() {
    this.headers['Content-Type'] = this.contentType;

    this.response.writeHead(this.statusCode, this.headers);
    this.response.end(this.content, this.characterEncoding);
  }
}
