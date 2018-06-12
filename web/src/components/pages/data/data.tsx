import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../../modal/modal';
import { CardAction, Button } from '../../ui/ui';
import { trackDataset } from '../../../services/tracker';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { DownloadIcon } from '../../ui/icons';
import AfterDownloadModal from './after-download-modal';

const commonVoiceDataset = {
  nick: 'commonvoice',
  size: 12,
  download: [
    'https://common-voice-data-download.s3.amazonaws.com/cv_corpus_v1.tar.gz',
  ],
};

const datasets = [
  {
    name: 'LibriSpeech',
    nick: 'librispeech',
    size: 57.2,
    url: 'https://www.openslr.org/12',
    download: [],
    license: {
      name: 'CC-BY-4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  {
    nick: 'ted',
    size: 54,
    url: 'https://www.openslr.org/51/',
    download: ['https://www.openslr.org/resources/51/TEDLIUM_release-3.tgz'],
    license: {
      name: 'CC-BY-NC-ND 3.0',
      url: 'https://creativecommons.org/licenses/by-nc-nd/3.0/',
    },
  },
  {
    name: 'VoxForge',
    nick: 'voxforge',
    size: 10.4,
    url: 'http://www.repository.voxforge1.org/downloads/SpeechCorpus/Trunk/',
    download: [
      'https://s3.us-east-2.amazonaws.com/common-voice-data-download/voxforge_corpus_v1.0.0.tar.gz',
    ],
    license: {
      name: 'GNU-GPL',
      url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
    },
  },
  {
    name: 'Tatoeba',
    nick: 'tatoeba',
    size: 3.8,
    url: 'https://tatoeba.org/eng/downloads',
    download: ['https://downloads.tatoeba.org/audio/tatoeba_audio_eng.zip'],
    license: {
      name: 'license-mixed',
      url: 'https://tatoeba.org/eng/downloads',
    },
  },
];

const datasetBundle = {
  nick: 'bundle',
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

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {}

interface ModalInfo {
  nick: string;
  size: number;
  download: string[];
}

interface State {
  showModalFor?: 'download-starting' | 'email' | ModalInfo;
}

class DataPage extends React.Component<Props, State> {
  state: State = { showModalFor: null };

  showModalFor = (info?: ModalInfo) => {
    trackDataset(info === datasetBundle ? 'open-bundle-modal' : 'open-modal');
    this.setState({ showModalFor: info });
  };

  startDownload = () => {
    const info: ModalInfo = this.state.showModalFor as ModalInfo;
    for (const url of info.download) {
      window.open(url, '_blank');
    }

    const { user } = this.props;

    trackDataset(`download-${info.nick}`);

    if (!user.hasDownloaded) {
      this.props.updateUser({ hasDownloaded: true });
    }

    this.setState({
      showModalFor:
        user.hasDownloaded || user.sendEmails ? 'download-starting' : 'email',
    });
  };

  hideModal = () => {
    this.setState({ showModalFor: null });
  };

  render() {
    const { getString } = this.props;
    const { showModalFor } = this.state;

    return (
      <div id="data-container">
        {typeof showModalFor === 'string' ? (
          <AfterDownloadModal
            onRequestClose={this.hideModal}
            titleOnly={showModalFor == 'download-starting'}
          />
        ) : (
          showModalFor && (
            <Modal
              innerClassName="download-modal"
              buttons={{
                [getString('data-download-yes')]: this.startDownload,
                [getString('data-download-deny')]: this.hideModal,
              }}
              onRequestClose={this.hideModal}>
              <Localized
                id="data-download-modal"
                $size={showModalFor.size}
                size={<b />}>
                <p />
              </Localized>
            </Modal>
          )
        )}

        <div id="common-voice-data">
          <CardAction onClick={() => this.showModalFor(commonVoiceDataset)}>
            <DownloadIcon />
            <Localized id="data-download-button">
              <span />
            </Localized>
          </CardAction>
          <div id="common-voice-license">
            <Localized
              id="license"
              $license="CC-0"
              licenseLink={
                <a
                  href="https://creativecommons.org/choose/zero/"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }>
              <span />
            </Localized>
          </div>
        </div>

        <Localized id="data-subtitle">
          <h2 />
        </Localized>

        <Localized id="data-explanatory-text">
          <p id="explanatory-text" />
        </Localized>

        <Localized
          id="data-get-started"
          speechBlogLink={
            <a
              id="speech-blog-link"
              href="https://github.com/mozilla/DeepSpeech/blob/master/README.md#common-voice-training-data"
              target="_blank"
              rel="noopener noreferrer"
            />
          }>
          <span />
        </Localized>

        <hr />

        <Localized id="data-other-title">
          <h2 id="others-head" />
        </Localized>

        <div id="datasets">
          {datasets.map((dataset: any, i) => (
            <div key={i} className="dataset">
              <div className="contents">
                <h2>
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer">
                    {dataset.name ? (
                      dataset.name
                    ) : (
                      <Localized id={'data-other-' + dataset.nick + '-name'}>
                        <span />
                      </Localized>
                    )}
                  </a>
                </h2>
                <Localized id={'data-other-' + dataset.nick + '-description'}>
                  <p />
                </Localized>
              </div>

              <div>
                <Localized
                  id="license"
                  $license={
                    getString(dataset.license.name) || dataset.license.name
                  }
                  licenseLink={
                    <a
                      href={dataset.license.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }>
                  <div className="license" />
                </Localized>

                <div className="action">
                  {dataset.download.length < 1 ? (
                    <Localized id="data-other-goto" $name={dataset.name}>
                      <Button
                        outline
                        className="card-action"
                        onClick={() => {
                          window.open(dataset.url, '_blank');
                        }}
                      />
                    </Localized>
                  ) : (
                    <CardAction onClick={() => this.showModalFor(dataset)}>
                      <DownloadIcon />
                      <Localized id="data-other-download">
                        <span />
                      </Localized>
                    </CardAction>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div id="dataset-bundle">
          <CardAction onClick={() => this.showModalFor(datasetBundle)}>
            <DownloadIcon />
            <Localized id="data-bundle-button">
              <span />
            </Localized>
          </CardAction>
          <Localized id="data-bundle-description">
            <div id="bundle-info" />
          </Localized>
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
)(withLocalization(DataPage));
