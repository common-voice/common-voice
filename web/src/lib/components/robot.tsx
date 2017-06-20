import { h, Component } from 'preact';
import RobotTalker from 'robot-talker';

const MODE_GREETINGS = '/img/robot-greetings.png';
const MODE_LISTENING = '/img/robot-listening.png';
const MODE_THINKING = '/img/robot-thinking.png';
const MODE_THANKS = '/img/robot-thanks.png';
const MODE_THUMBS_UP = '/img/robot-thumbs-up.png';

const SPEECH_GREETINGS = 'Click here to help me learn!';

interface Props {
  position?: string;
  onClick(page: string): void;
}

interface State {
  src: string;
  speech: string;
}

/**
 * Handle robot transitions.
 */
export default class Robot extends Component<Props, State> {
  state = {
    src: MODE_GREETINGS,
    speech: ''
  }

  constructor(props) {
    super(props);

    this.handleSpeechClick = this.handleSpeechClick.bind(this);
  }

  private handleSpeechClick() {
    this.props.onClick('record');
  }

  componentWillUpdate(nextProps: Props) {
    let text, src;
    if (nextProps.position === 'record') {
      text = ''; // hides speech
      src = MODE_LISTENING;
    } else if (nextProps.position === 'listen') {
      text = '';
      src = MODE_THINKING;
    } else if (nextProps.position === 'thanks') {
      text = '';
      src = MODE_THUMBS_UP; // Thumbs up for thanks :)
    } else {
      text = SPEECH_GREETINGS;
      src = MODE_GREETINGS;
    }

    this.setState({
      src: src,
      speech: text
    });
  }

  render() {
    return <div className={'robot ' + this.props.position}>
             <div class="bubble" onClick={this.handleSpeechClick}>
               {this.state.speech}
             </div>
             <img src={this.state.src} />
             <RobotTalker>{this.props.children}</RobotTalker>
           </div>;
  }
}
