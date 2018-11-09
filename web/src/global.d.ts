declare global {
  interface Navigator {
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
  }

  interface Window {
    [key: string]: any;
  }
}

export {};
