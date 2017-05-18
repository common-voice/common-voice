/**
 * Handles any ajax and web 2.0 server ninjas.
 */
export default class API {
  private static DEFAULT_BASE: string = './api/';

  /**
   * Sadly, had to implement fetch myself as it's not supported enough.
   */
  private fetch(path: string, options?: any): Promise<any> {
    options = options || {};
    return new Promise((res: Function, rej: Function) => {
      var req = new XMLHttpRequest();
      req.open(options.type || 'GET', path);

      if (options.headers) {
        Object.keys(options.headers).forEach((header: string) => {
          req.setRequestHeader(header, options.headers[header]);
        });
      }

      if (options.responseType) {
        req.responseType = options.responseType;
      }

      req.onload = () => {
        res(req);
      };
      req.onerror = (err: ErrorEvent) => {
        rej(err);
      };

      req.send(options.body || '');
    });
  }

  private fetchText(path: string, options?: any): Promise<any> {
    return this.fetch(path, options).then((req: XMLHttpRequest) => {
      return req.responseText;
    });
  }

  private requestResourceText(resource): Promise<string> {
    return this.fetchText(this.getPath(resource));
  }

  private requestResource(resource): Promise<string> {
    return this.fetch(this.getPath(resource));
  }

  private getPath(resource: string): string {
    return API.DEFAULT_BASE + resource;
  }

  getSentence() {
    return this.requestResourceText('sentence');
  }

  /**
   * Ask the server for a clip
   */
  getRandomClip(): Promise<any> {
    return this.fetch('upload/random', { responseType: 'blob' })
      .then((req: XMLHttpRequest) => {
        let src = window.URL.createObjectURL(req.response);
        let sentence = decodeURIComponent(req.getResponseHeader('sentence'));
        return Promise.resolve([src, sentence]);
      });
  }
}
