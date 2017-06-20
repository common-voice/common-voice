import { h, Component } from 'preact';

const CHARACTER_DELAY = 80;
const PARAGRAPH_DELAY = 3500;

interface Props {
}

interface State {
  displayedText: string;
}

/**
 * Handle robot transitions.
 */
export default class RobotTalker extends Component<Props, State> {
  timeoutHandle: number;
  remainingParagraphs: string[];

  constructor(props) {
    super(props);
    this.nextParagraph = this.nextParagraph.bind(this);
    this.updateCharacter = this.updateCharacter.bind(this);
  }

  private updateCharacter() {
    if (this.remainingParagraphs.length < 1) { return; }

    let currentParagraph = this.remainingParagraphs[0];
    if (currentParagraph.length < 1) {
      this.remainingParagraphs.shift();
      this.nextParagraph();
      return;
    }

    let c = currentParagraph[0];
    this.remainingParagraphs[0] = currentParagraph.substr(1);
    let newText = this.state.displayedText + c;
    this.setState({
      displayedText: newText
    });

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    this.timeoutHandle = setTimeout(this.updateCharacter, CHARACTER_DELAY);
  }

  private nextParagraph() {
    if (this.remainingParagraphs.length < 1) {
      return;
    }

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    this.timeoutHandle = setTimeout(this.updateCharacter, PARAGRAPH_DELAY);

    // Clear text after a half delay
    setTimeout(() => {
      this.setState({
        displayedText: ''
      });
    }, PARAGRAPH_DELAY * 0.85);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.remainingParagraphs = [];
      for (let i = 0; i < nextProps.children.length; i++) {
        let textParent = nextProps.children[i];
        if (textParent) {
          this.remainingParagraphs.push(textParent.children[0]);
        }
      }

      this.setState({
        displayedText: ''
      });
      setTimeout(this.updateCharacter, 2000);
    }
  }

  render() {
    return <div class="robot-talker">{this.state.displayedText}</div>;
  }
}
