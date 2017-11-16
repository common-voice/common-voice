import * as React from 'react';

const MODE_GREETINGS = '/img/robot-greetings.png';
const MODE_LISTENING = '/img/robot-listening.png';
const MODE_THINKING = '/img/robot-thinking.png';
const MODE_THUMBS_UP = '/img/robot-thumbs-up.png';

const MODES: any = {
  record: MODE_LISTENING,
  listen: MODE_THINKING,
  thanks: MODE_THUMBS_UP,
};

interface Props {
  position?: keyof typeof MODES;
}

const head = [30, 0, 80, 35];
const heart = [53, 45, 65, 55];

const touchCode = [head, head, heart, head];

export default class Robot extends React.Component<Props> {
  private remainingCode = touchCode.slice();
  private secretDoorToStaging = ({
    currentTarget,
    targetTouches,
  }: React.TouchEvent<HTMLImageElement>) => {
    const touch = targetTouches[0];
    if (!touch) return;

    const rect = currentTarget.getBoundingClientRect();
    const x = 100 * (touch.clientX - rect.left) / rect.width;
    const y = 100 * (touch.clientY - rect.top) / rect.height;

    const [x1, y1, x2, y2] = this.remainingCode.shift();

    if (x < x1 || x > x2 || y < y1 || y > y2) {
      this.remainingCode = touchCode.slice();
    }
    if (this.remainingCode.length == 0) {
      location.href = 'https://voice.allizom.org/';
    }
  };

  render() {
    const { position } = this.props;
    return (
      <img
        className={'robot ' + position}
        src={MODES[position] || MODE_GREETINGS}
        onTouchStart={this.secretDoorToStaging}
      />
    );
  }
}
