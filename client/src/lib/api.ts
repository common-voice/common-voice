const DEFAULT_BASE = './api/';

export default class API {
  request(resource: string) {
    return fetch(DEFAULT_BASE + resource).then(response => {
      return response.text();
    })
  }

  getSentence() {
    return this.request('sentence');
  }
}
