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

const head = [20, 0, 90, 35];
const heart = [50, 45, 75, 55];

const touchCode = [head, head, heart, head];

export default class Robot extends React.PureComponent<Props> {
  private remainingCode = touchCode.slice();
  private secretDoorToStaging = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLImageElement>) => {
    const { height, left, top, width } = currentTarget.getBoundingClientRect();
    const x = 100 * (clientX - left) / width;
    const y = 100 * (clientY - top) / height;

    const [x1, y1, x2, y2] = this.remainingCode.shift();

    if (x < x1 || x > x2 || y < y1 || y > y2) {
      this.remainingCode = touchCode.slice();
    }
    if (this.remainingCode.length == 0) {
      location.href = prompt('URL') || 'https://voice.allizom.org/';
    }
  };

  render() {
    const { position } = this.props;
    return (
      <img
        className={'robot ' + position}
        src={MODES[position] || MODE_GREETINGS}
        onClick={this.secretDoorToStaging}
      />
    );
  }
}
