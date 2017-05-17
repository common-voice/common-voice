import { Collection } from 'mongodb';

export default class User {
  constructor(public collection: Collection) {
  }
}
