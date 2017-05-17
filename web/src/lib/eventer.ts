export default class Eventer {
  on(type: string, cb: Function) {
    this['_on' + type] = this['_on' + type] || [];
    this['_on' + type].push(cb);
  }

  trigger(type: string, value: any) {
    if (this['_on' + type]) {
      this['_on' + type].forEach((cb: Function) => {
        cb(value)
      });
    }
  }
}
