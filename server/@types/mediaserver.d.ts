declare module 'mediaserver' {
  import { IncomingMessage, ServerResponse } from 'http';

  function pipe(
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    type?: string,
    callback?: (path: string) => void
  ): boolean;
}
