declare global {
  interface AudioContext {
    createMediaStreamDestination: any;
  }

  interface Navigator {
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
  }
}

export {};
