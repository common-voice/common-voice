import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const MODE_GREETINGS = '/img/robot-greetings.png';
const MODE_LISTENING = '/img/robot-listening.png';
const MODE_THINKING = '/img/robot-thinking.png';
const MODE_THANKS = '/img/robot-thanks.png';
const MODE_THUMBS_UP = '/img/robot-thumbs-up.png';

const SPEECH_GREETINGS = 'Click here to help me learn!';

interface Props extends RouteComponentProps<{}> {
  children?: React.ReactNode;
  position?: string;
}

const Robot = ({ children, position }: Props) => {
  let speech = '';
  let src = '';
  if (position === 'record') {
    src = MODE_LISTENING;
  } else if (position === 'listen') {
    src = MODE_THINKING;
  } else if (position === 'thanks') {
    src = MODE_THUMBS_UP; // Thumbs up for thanks :)
  } else {
    speech = SPEECH_GREETINGS;
    src = MODE_GREETINGS;
  }

  return (
    <div className={'robot ' + position}>
      <Link className="bubble" to="/record">
        {speech}
      </Link>
      <img src={src} />
      <div className="robot-talker">{children}</div>
    </div>
  );
};

export default withRouter(Robot);
