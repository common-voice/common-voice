import { ServerResponse } from 'http';

export const CONTENT_TYPES = {
  TXT: 'text/plain',
  HTML: 'text/html',
  JS: 'text/javascript',
  CSS: 'text/css',
  JSON: 'application/json',
  PNG: 'image/png',
  JPG: 'image/jpg',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
  WAV: 'audio/wav',
  MP4: 'video/mp4',
  WOFF: 'application/font-woff',
  TTF: 'application/font-ttf',
  EOT: 'application/vnd.ms-fontobject',
  OTF: 'application/font-otf',
};

export default function respond(
  response: ServerResponse,
  content: string = '',
  statusCode: number = 200,
  contentType: string = CONTENT_TYPES.TXT,
  headers: any = {},
  characterEncoding: string = 'utf-8'
) {
  response.writeHead(statusCode, {
    ...headers,
    'Content-Type': contentType,
    Pragma: 'no-cache',
    Expires: -1,
  });
  response.end(content, characterEncoding);
}
