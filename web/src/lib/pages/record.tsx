import API from '../api';
import User from '../user';
import { h, Component } from 'preact';
import Icon from '../icon';
import AudioIOS from './record/audio-ios';
import AudioWeb from './record/audio-web';
import ERROR_MSG from '../../error-msg';
import { countSyllables, isNativeIOS, generateGUID } from '../utility';

const SOUNDCLIP_URL = '/upload/';
const PAGE_NAME = 'record';

interface RecordProps {
  active: string;
  user: User;
}

interface RecordState {
  sentence: string,
  playing: boolean,
  recording: boolean,
  recordingStartTime: number,
  recordings: any[]
}

export default class RecordPage extends Component<RecordProps, RecordState> {
  name: string = PAGE_NAME;
  audio: AudioWeb | AudioIOS;
  playerEl: HTMLMediaElement;
  api: API;

  state = {
    sentence: "",
    recording: false,
    playing: false,
    recordingStartTime: 0,
    recordings: []
  };

  constructor() {
    super();
    this.api = new API();
    // Use different audio helpers depending on if we are web or native iOS.
    if (isNativeIOS()) {
      this.audio = new AudioIOS();
    } else {
      this.audio = new AudioWeb();
    }

    this.newSentence();
  }

  onRecordClick = () => {
    if (this.state.recording) {
      this.stopRecording();
    } else {
      this.audio.init().then(() => {
        this.startRecording();
      });
    }
  }

  startRecording() {
    this.setState({
      recording: true,
      // TODO: reanble display of recording time at some point.
      // recordingStartTime: this.audio.audioContext.currentTime
    });
    this.audio.start();
  }

  stopRecording() {
    this.audio.stop().then(() => {
      this.setState({ recording: false });
    });
  }

  upload() {
    // Save
    // var a = document.createElement('a');
    // var url = window.URL.createObjectURL(this.audio.lastRecording);
    // a.href = url;
    // a.download = "rec.ogg";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(url);

    // Upload
    let uploadPromise = new Promise(
      (resolve: EventListener, reject: EventListener) => {
        var req = new XMLHttpRequest();
        req.upload.addEventListener('load', resolve);
        req.upload.addEventListener("error", reject);
        req.open('POST', SOUNDCLIP_URL);
        req.setRequestHeader('uid', this.props.user.getId());
        req.setRequestHeader('sentence',
          encodeURIComponent(this.state.sentence));

        // For IOS, we don't upload binary data but base64. Here we
        // make sure the server knows what to expect.
        if (this.audio.lastRecordingData.type === AudioIOS.AUDIO_TYPE) {
          req.setRequestHeader('content-type', AudioIOS.AUDIO_TYPE);
        }

        req.send(this.audio.lastRecordingData);
      });

    uploadPromise.then(() => {
      console.log("Uploaded Ok.");
      this.audio.clear();
      this.newSentence();
    }).catch((e) => {
      console.error("Upload Error: " + e);
      // TODO: put this message in the DOM
      // ERROR_MSG.ERR_UPLOAD_FAILED);
    });
  }

  play = () => {
    if (!this.audio.lastRecordingData) {
      console.error('cannot play when there is no recording');
      return;
    }

    if (this.state.playing) {
      this.playerEl.pause();
      this.setState({ playing: false });
      return;
    }

    this.playerEl.src = this.audio.lastRecordingUrl;
    this.playerEl.play();
    this.setState({ playing: true });
  }

  onPlay = () => {}

  onCanPlayThrough = () => {}

  onPlayEnded = () => {
    this.setState({ playing: false });
  }

  onNextClick = () => {
    this.audio.clear();
    this.newSentence();
  }

  newSentence() {
    this.api.getSentence().then(sentence => {
      this.setState({ sentence });
    });
  }

  render() {
    return <div id="record-container" className={this.props.active +
                (this.state.recording ? ' recording': '')}>
      <p id="recordings-count">{this.state.recordings.length + 1} of 3</p>
      <div className="record-sentence">
          "{this.state.sentence}"
      </div>
      <img onClick={this.onRecordClick} className="robot" src="/img/robot.png" />
      <p id="record-help">Please read the above sentence and tap me to record.</p>
      <div id="toolbar">
        <Icon type="redo" onClick={this.onNextClick} />
        <p>Naw, generate a new sentence please.</p>
      </div>
      <input id="sensitivity" style="display: none" type="range" min="1" max="200"></input>
      <audio id="player" controls class="disabled"
        onCanPlayThrough={this.onCanPlayThrough}
        onPlay={this.onPlay}
        onEnded={this.onPlayEnded}
        ref={el => this.playerEl = el as HTMLAudioElement} />
    </div>;
  }
}
