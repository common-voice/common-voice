import * as React from 'react';
import Modal from '../../modal/modal';
import { CardAction, Hr } from '../../ui/ui';
import { DownloadIcon } from '../../ui/icons';

const commonVoiceDataset = {
  size: 30,
  url: 'https://mozilla.org',
};

const datasets = [
  {
    name: 'LibriSpeech',
    description:
      'LibriSpeech is a corpus of approximately 1000 hours of 16Khz read English speech.',
    size: 20,
    url: 'https://mozilla.org',
    license: {
      name: 'CC-BY-4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  {
    name: 'TED-LIUM Corpus',
    description:
      'The TED-LIUM corpus was made from audio talks and their transcriptions available on the TED website.',
    size: 35,
    url: 'https://mozilla.org',
    license: {
      name: 'CC-BY-NC-ND 3.0',
      url: 'https://creativecommons.org/licenses/by-nc-nd/3.0/',
    },
  },
  {
    name: 'VoxForge',
    description:
      'VoxForge was set up to collect transcribed speech for use with Free and Open Source Speech Rcognition Engines.',
    size: 52,
    url: 'https://mozilla.org',
    license: {
      name: 'GNU-GPL',
      url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
    },
  },
  {
    name: 'Tatoeba',
    description:
      'Tatoeba is a large database of sentences and translations. Its content is ever-growing and results from the voluntary contributions of thousands of members.',
    size: 17,
    url: 'https://mozilla.org',
    license: {
      name: 'CC-BY-2.0',
      url: 'https://creativecommons.org/licenses/by/2.0/',
    },
  },
];

const datasetBundle = {
  size: 135,
  url: 'https://mozilla.org',
};

interface ModalInfo {
  size: number;
  url: string;
}

interface State {
  showModalFor?: ModalInfo;
}

export default class DataPage extends React.Component<{}, State> {
  state: State = { showModalFor: null };

  showModalFor = (info?: ModalInfo) => {
    this.setState({ showModalFor: info });
  };

  hideModal = () => {
    this.setState({ showModalFor: null });
  };

  render() {
    const { showModalFor } = this.state;
    return (
      <div id="data-container">
        {showModalFor && (
          <Modal
            buttons={{ Yes: showModalFor.url, No: this.hideModal }}
            onRequestClose={this.hideModal}>
            You are about to initiate a download of <b>{showModalFor.size}GB</b>,
            proceed?
          </Modal>
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

        <a href="https://mozilla.org" target="_blank" rel="noopener noreferrer">
          Get Started with Speech Recognition
        </a>

        <Hr />

        <h2 id="others-head">Other voice datasets...</h2>

        <div id="datasets">
          {datasets.map(dataset => (
            <div key={dataset.name} className="dataset">
              <div className="contents">
                <h2>{dataset.name}</h2>
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
