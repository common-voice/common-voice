import * as React from 'react';

const MODE_GREETINGS = '/img/robot-greetings.png';
const MODE_LISTENING = '/img/robot-listening.png';
const MODE_THINKING = '/img/robot-thinking.png';
const MODE_THUMBS_UP = '/img/robot-thumbs-up.png';

interface Props {
  position?: string;
}

const modes: any = {
  record: MODE_LISTENING,
  listen: MODE_THINKING,
  thanks: MODE_THUMBS_UP,
};

export default ({ position }: Props) => (
  <img
    className={'robot ' + position}
    src={modes[position] || MODE_GREETINGS}
  />
);
