import { h, Component } from 'preact';

interface FontIcons {
  [key: string]: string;
  bullhorn: string;
  hamburger: string;
  redo: string;
  play: string;
  pause: string;
  undo: string;
  check: string;
  x: string;
  github: string;
  firefox: string;
  chrome: string;
  help: string;
  discourse: string;
}

const ICONS: FontIcons = {
  bullhorn: '',
  hamburger: '',
  redo: '',
  play: '',
  pause: '',
  undo: '',
  check: '',
  x: '',
  github: '',
  firefox: '',
  chrome: '',
  help: '',
  discourse: '',
};

interface Props {
  type: string;
  id?: string;
  className?: string;
  onClick?(event: MouseEvent): void;
}

/**
 * Helper component for using icon fonts.
 */
export default class Icon extends Component<Props, void> {
  getIcon(name: string): string {
    return ICONS[name];
  }

  render() {
    let icon = this.getIcon(this.props.type);
    return (
      <span
        onClick={this.props.onClick}
        id={this.props.id}
        className={this.props.className}
        aria-hidden="true"
        data-icon={icon}
      />
    );
  }
}
