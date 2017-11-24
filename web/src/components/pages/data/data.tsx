import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../../modal/modal';
import { CardAction, Hr } from '../../ui/ui';
import { trackDataset } from '../../../services/tracker';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { DownloadIcon } from '../../ui/icons';
import EmailModal from './email-modal';

const commonVoiceDataset = {
  size: 13,
  download: ['https://mozilla.org'],
};

const datasets = [
  {
    name: 'LibriSpeech',
    description:
      'LibriSpeech is a corpus of approximately 1000 hours of 16Khz read English speech derived from read audiobooks from the LibriVox project.',
    size: 57.2,
    url: 'http://www.openslr.org/12',
    download: [
      'http://www.openslr.org/resources/12/dev-clean.tar.gz',
      'http://www.openslr.org/resources/12/dev-other.tar.gz',
      'http://www.openslr.org/resources/12/test-clean.tar.gz',
      'http://www.openslr.org/resources/12/test-other.tar.gz',
      'http://www.openslr.org/resources/12/train-clean-100.tar.gz',
      'http://www.openslr.org/resources/12/train-clean-360.tar.gz',
      'http://www.openslr.org/resources/12/train-other-500.tar.gz',
    ],
    license: {
      name: 'CC-BY-4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  {
    name: 'TED-LIUM Corpus',
    description:
      'The TED-LIUM corpus was made from audio talks and their transcriptions available on the TED website.',
    size: 19.8,
    url: 'http://www.openslr.org/7/',
    download: ['http://www.openslr.org/resources/7/TEDLIUM_release1.tar.gz'],
    license: {
      name: 'CC-BY-NC-ND 3.0',
      url: 'https://creativecommons.org/licenses/by-nc-nd/3.0/',
    },
  },
  {
    name: 'VoxForge',
    description:
      'VoxForge was set up to collect transcribed speech for use with Free and Open Source Speech Recognition Engines.',
    size: 52,
    url: 'http://www.repository.voxforge1.org/downloads/SpeechCorpus/Trunk/',
    download: [],
    license: {
      name: 'GNU-GPL',
      url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
    },
  },
  {
    name: 'Tatoeba',
    description:
      'Tatoeba is a large database of sentences, translations, and spoken audio for use in language learning. For convenience, we have bundled all English audio into a single downloadable archive.',
    size: 17,
    url: 'https://tatoeba.org/eng/downloads',
    download: [
      'http://downloads.tatoeba.org/exports/sentences_with_audio.tar.bz2',
    ],
    license: {
      name: 'Mixed',
      url: 'https://tatoeba.org/eng/downloads',
    },
  },
];

const datasetBundle = {
  size: commonVoiceDataset.size + datasets.reduce((sum, d) => sum + d.size, 0),
  download: [
    commonVoiceDataset.download,
    ...datasets.reduce((urls, d) => [...urls, ...d.download], []),
  ],
};

interface PropsFromState {
  user: User.State;
}

interface PropsFromDispatch {
  updateUser: typeof User.actions.update;
}

interface Props extends PropsFromState, PropsFromDispatch {}

interface ModalInfo {
  size: number;
  download: string[];
}

interface State {
  showModalFor?: 'email' | ModalInfo;
}

class DataPage extends React.Component<Props, State> {
  state: State = { showModalFor: null };

  showModalFor = (info?: ModalInfo) => {
    trackDataset(info === datasetBundle ? 'open-bundle-modal' : 'open-modal');
    this.setState({ showModalFor: info });
  };

  startDownload = () => {
    for (const url of (this.state.showModalFor as ModalInfo).download) {
      window.open(url, '_blank');
    }

    const { user } = this.props;

    trackDataset(
      this.state.showModalFor === datasetBundle ? 'download-bundle' : 'download'
    );

    if (user.hasDownloaded) {
      this.setState({ showModalFor: null });
      return;
    }

    this.props.updateUser({ hasDownloaded: true });

    this.setState({ showModalFor: 'email' });
  };

  hideModal = () => {
    this.setState({ showModalFor: null });
  };

  render() {
    const { showModalFor } = this.state;
    return (
      <div id="data-container">
        {showModalFor === 'email' ? (
          <EmailModal onRequestClose={this.hideModal} />
        ) : (
          showModalFor && (
            <Modal
              innerClassName="download-modal"
              buttons={{
                Yes: this.startDownload,
                No: this.hideModal,
              }}
              onRequestClose={this.hideModal}>
              <p>
                You are about to initiate a download of{' '}
                <b>{showModalFor.size}GB</b>, proceed?
              </p>
            </Modal>
          )
        )}

        <div id="common-voice-data">
          <CardAction onClick={() => this.showModalFor(commonVoiceDataset)}>
            <DownloadIcon />Download Common Voice Data
          </CardAction>
          <div id="common-voice-license">
            License:{' '}
            <a
              href="https://creativecommons.org/choose/zero/"
              target="_blank"
              rel="noopener noreferrer">
              CC-0
            </a>
          </div>
        </div>

        <h2>
          Data dissemination positioning statement, lorem ipsum dolor sit amet,
          consectetur adipisicing elit, sed do eiusmod tempor incididunt.
        </h2>

        <p id="explanatory-text">
          If needed, explanatory copy. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        <a
          id="speech-blog-link"
          href="https://github.com/mozilla/DeepSpeech/blob/master/README.md#common-voice-training-data"
          target="_blank"
          rel="noopener noreferrer">
          Get Started with Speech Recognition
        </a>

        <Hr />

        <h2 id="others-head">Other voice datasets...</h2>

        <div id="datasets">
          {datasets.map(dataset => (
            <div key={dataset.name} className="dataset">
              <div className="contents">
                <h2>
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer">
                    {dataset.name}
                  </a>
                </h2>
                <p>{dataset.description}</p>
              </div>

              <div>
                <div className="license">
                  License:{' '}
                  <a
                    href={dataset.license.url}
                    target="_blank"
                    rel="noopener noreferrer">
                    {dataset.license.name}
                  </a>
                </div>

                <div className="action">
                  <CardAction onClick={() => this.showModalFor(dataset)}>
                    <DownloadIcon />Download
                  </CardAction>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div id="dataset-bundle">
          <CardAction onClick={() => this.showModalFor(datasetBundle)}>
            <DownloadIcon />Download Dataset Bundle
          </CardAction>
          <div id="bundle-info">
            Common Voice data plus all other voice datasets above.
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  user: state.user,
});

const mapDispatchToProps = {
  updateUser: User.actions.update,
};

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(DataPage);
