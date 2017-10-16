class User {
  userid: string;
  demoPath: string;
  submitted: string[];
  verified: string[];
  listens: number;

  constructor(userid: string) {
    this.userid = userid;
    this.submitted = [];
    this.verified = [];
    this.listens = 0;
  }
}

interface UserList {
  [key: string]: User;
}

interface UserMetrics {
  users: number;
  listeners: number;
  submitters: number;
}

/**
 * Keeps a list of users and their metadata.
 */
export default class Users {
  list: UserList;
  metrics: UserMetrics;
  loaded: boolean;

  constructor() {
    this.list = {};
    this.loaded = false;
  }

  private getUser(userid: string): User {
    let user = this.list[userid];
    if (!user) {
      user = new User(userid);
      this.list[userid] = user;
    }
    return user;
  }

  addClip(userid: string, path: string): void {
    const user = this.getUser(userid);
    user.submitted.push(path);
  }

  // Note: for now we haven't figured out how to count this.
  addVerified(userid: string, path: string): void {
    const user = this.getUser(userid);
    user.verified.push(path);
  }

  addListen(userid: string): void {
    const user = this.getUser(userid);
    ++user.listens;
  }

  addDemographics(userid: string, path: string) {
    const user = this.getUser(userid);
    user.demoPath = path;
  }

  setLoaded() {
    this.metrics = {
      users: 0,
      listeners: 0,
      submitters: 0,
    };

    Object.keys(this.list).forEach((userid: string) => {
      ++this.metrics.users;

      if (this.list[userid].listens > 0) {
        ++this.metrics.listeners;
      }

      if (this.list[userid].submitted.length > 0) {
        ++this.metrics.submitters;
      }
    });

    this.loaded = true;
  }

  getCurrentMetrics(): UserMetrics | null {
    if (!this.loaded) {
      console.error('cannot get user metrics before loading');
      return null;
    }

    return this.metrics;
  }
}
