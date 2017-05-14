export default class Component<State> {
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
}
