import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import App from '../../../web/src/components/app';

const [startHTML, endHTML] = fs
  .readFileSync(
    path.join(
      __dirname,
      '..',
      '..',
      'server',
      'src',
      'render-web',
      'index.html'
    ),
    'utf-8'
  )
  .split('<!-- APP_HERE -->');

export default function renderWeb(
  request: http.IncomingMessage,
  response: http.ServerResponse
) {
  response.write(startHTML, 'utf-8');

  const { NODE_ENV } = process.env;

  process.env.NODE_ENV = 'production';
  const reactNodeStream = renderToNodeStream(
    <StaticRouter context={{}} location={request.url}>
      <App />
    </StaticRouter>
  );

  reactNodeStream.pipe(response, { end: false });

  reactNodeStream.on('end', () => {
    response.end(endHTML, 'utf-8');
    process.env.NODE_ENV = NODE_ENV;
  });
}
