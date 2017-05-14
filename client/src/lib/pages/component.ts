import Eventer from '../eventer';

export default class Component<State> extends Eventer {
  state: State = Object.create(null);
  updateTimeout: number;
  setState(state: State) {
    let needsUpdating = false;
    for (let k in state) {
      if (this.state[k] != state[k]) {
        this.state[k] = state[k];
        needsUpdating = true;
      }
    }
    if (needsUpdating) {
      this.forceUpdate();
    }
  }
  forceUpdate() {
    if (this.updateTimeout) {
      return;
    }
    this.updateTimeout = setTimeout(() => {
      this.update();
      this.updateTimeout = 0;
    });
  }
  update() {}

  on(type: string, cb: Function) {
    this['_on' + type] = this['_on' + type] || [];
    this['_on' + type].push(cb);
  }

  trigger(type: string, value: any) {
    if (this['_on' + type]) {
      this['_on' + type].forEach((cb: Function) => {
        cb(value, this.state)
      });
    }
  }
}
