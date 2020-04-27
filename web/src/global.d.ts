declare global {
  interface Navigator {
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
    standalone?: boolean;
  }

  interface Window {
    [key: string]: any;
  }
}

export {};
