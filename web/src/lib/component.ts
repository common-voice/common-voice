import Eventer from 'eventer';

/**
 * Allows debounced updates when state chages.
 */
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

  /**
   * Called whenever page state has changed (debounced).
   */
  update() {}

}
