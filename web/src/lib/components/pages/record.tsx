import API from '../../api';
import User from '../../user';
import { h, Component } from 'preact';
import Icon from '../icon';
import AudioIOS from './record/audio-ios';
import AudioWeb, { AudioInfo } from './record/audio-web';
import ERROR_MSG from '../../../error-msg';
import { countSyllables, isNativeIOS, generateGUID } from '../../utility';

const SET_COUNT = 3;
const SOUNDCLIP_URL = '/upload/';
const PAGE_NAME = 'record';

interface RecordProps {
  active: string;
  user: User;
}

interface RecordState {
  sentences: string[],
  playing: boolean,
  recording: boolean,
  recordingStartTime: number,
  recordings: any[],
  uploadProgress: number
}

export default class RecordPage extends Component<RecordProps, RecordState> {
  name: string = PAGE_NAME;
  audio: AudioWeb | AudioIOS;
  playerEl: HTMLMediaElement;
  api: API;

  state = {
    sentences: [],
    recording: false,
    playing: false,
    recordingStartTime: 0,
    recordings: [],
    uploadProgress: 0
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

    this.newSentenceSet();

    // Bind now, to avoid memory leak when setting handler.
    this.processNextClip = this.processNextClip.bind(this);
    this.uploadSet = this.uploadSet.bind(this);
  }

  private processNextClip(info: AudioInfo) {
    let recordings = this.state.recordings;
    recordings.push(info);

    this.setState({
      recordings: recordings,
      recording: false
    });
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
    this.audio.stop().then(this.processNextClip);;
  }

  private uploadOne(blob: Blob, sentence: string, progress?: Function) {
    return new Promise((resolve: EventListener, reject: EventListener) => {
      let blob = this.audio.last.blob;
      var req = new XMLHttpRequest();
      req.upload.addEventListener('load', resolve);
      req.upload.addEventListener("error", reject);
      req.open('POST', SOUNDCLIP_URL);
      req.setRequestHeader('uid', this.props.user.getId());
      req.setRequestHeader('sentence',
        encodeURIComponent(this.state.sentences[0]));

      // For IOS, we don't upload binary data but base64. Here we
      // make sure the server knows what to expect.
      if (blob.type === AudioIOS.AUDIO_TYPE) {
        req.setRequestHeader('content-type', AudioIOS.AUDIO_TYPE);
      }

      if (progress) {
        req.addEventListener('progress', evt => {
          let total = evt.lengthComputable ? evt.total : 100;
          progress(100 * evt.loaded / total);
        });
      }

      req.send(blob);
    });

  }

  private uploadSet() {
    let blob = this.state.recordings[0].blob;
    let sentence = this.state.sentences[0];
    this.uploadOne(blob, sentence, loaded => {
      this.setState({ uploadProgress: loaded });
    }).then(() => {
      this.newSentenceSet();
      this.setState({
        recordings: [],
        uploadProgress: 0
      });
    });
  }

  play = () => {
    if (!this.audio.last) {
      console.error('cannot play when there is no recording');
      return;
    }

    if (this.state.playing) {
      this.playerEl.pause();
      this.setState({ playing: false });
      return;
    }

    this.playerEl.src = this.audio.last.url;
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
    this.newSentenceSet();
  }

  newSentenceSet() {
    this.api.getRandomSentences(SET_COUNT).then(sentences => {
      this.setState({ sentences: sentences.split('\n') });
    });
  }

  render() {
    let isFull = this.state.recordings.length >= SET_COUNT;
    let texts = [];

    // Get the text prompts.
    if (!isFull) {
      for (let i = 0; i < SET_COUNT; ++i) {

        // Figure out where each item is positioned.
        let className = 'text-box';
        if (i < this.state.recordings.length) {
          className = className + ' left';
        } else if (i > this.state.recordings.length) {
          className = className + ' right';
        }
        texts.push(<p className={className}>{this.state.sentences[i]}</p>);
      }
    }

    let className = this.props.active +
      (this.state.recording ? ' recording': '') +
      (isFull ? ' full': '');

    return <div id="record-container" className={className}>
      <p id="recordings-count">{this.state.recordings.length + 1} of 3</p>
      <div className="record-sentence">{texts}</div>
      <img onClick={this.onRecordClick} className="robot"
           src="/img/robot.png" />
      <p id="record-help">
        Please read the above sentence and tap me to record.
      </p>
      <div id="toolbar">
        <Icon type="redo" onClick={this.onNextClick} />
        <p>Naw, generate a new sentence please.</p>
      </div>
      <div id="voice-submit">
        <div>Thank you!</div>
        <button onClick={this.uploadSet}>Submit</button>
        <div className="progress">{this.state.uploadProgress}</div>
      </div>
      <audio id="player" controls class="disabled"
        onCanPlayThrough={this.onCanPlayThrough}
        onPlay={this.onPlay}
        onEnded={this.onPlayEnded}
        ref={el => this.playerEl = el as HTMLAudioElement} />
    </div>;
  }
}
