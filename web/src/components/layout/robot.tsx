import * as React from 'react';

const head = [20, 0, 90, 35];
const heart = [50, 45, 75, 55];

const touchCode = [head, head, heart, head];

export default class Robot extends React.PureComponent<{}> {
  private remainingCode = touchCode.slice();
  private secretDoorToStaging = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLImageElement>) => {
    const { height, left, top, width } = currentTarget.getBoundingClientRect();
    const x = (100 * (clientX - left)) / width;
    const y = (100 * (clientY - top)) / height;

    const [x1, y1, x2, y2] = this.remainingCode.shift();

    if (x < x1 || x > x2 || y < y1 || y > y2) {
      this.remainingCode = touchCode.slice();
    }
    if (this.remainingCode.length == 0) {
      location.href = prompt('URL') || 'https://voice.allizom.org/en/new';
    }
  };

  render() {
    return (
      <img
        className="robot"
        src="/img/robot-greetings.png"
        onClick={this.secretDoorToStaging}
      />
    );
  }
}
