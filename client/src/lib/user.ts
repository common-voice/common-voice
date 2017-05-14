import { generateGUID } from './utility';

/**
 * User tracking
 */
export default class User {

  userId: string;

  // Store userid on this object.
  constructor() {
    this.userId = this.getIdFromStorage();
  }

  private getIdFromStorage(): string {
    if (localStorage.userId) {
      return localStorage.userId;
    }

    localStorage.userId = generateGUID();
    return localStorage.userId;
  }

  public getId(): string {
    return this.userId;
  }
}
