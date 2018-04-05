import * as React from 'react';
import { connect } from 'react-redux';
import ProgressBar from '../../progress-bar/progress-bar';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { Button, Hr } from '../../ui/ui';
import HelpTranslateModal from './help-translate-modal';

const EN_POPULATION = 1522575000;

interface PropsFromState {
  api: API;
}

interface Locale {
  code?: string;
  name: string;
  population: number;
}

const LocalizationBox = ({
  locale,
  onShowHelpTranslateModal,
  progress,
}: {
  locale: Locale;
  onShowHelpTranslateModal?: (locale: Locale) => any;
  progress: number;
}) => (
  <li className="language">
    <div className="info">
      <h2>{locale.name}</h2>
      <div className="numbers">
        <div>
          <span>Speakers</span>
          <b>{locale.population.toLocaleString()}</b>
        </div>
        <Hr />
        <div>
          <span>Total</span>
          <b>{Math.round(progress * 100)}%</b>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
    {onShowHelpTranslateModal && (
      <button onClick={() => onShowHelpTranslateModal(locale)}>
        Help Translate >
      </button>
    )}
  </li>
);

interface Props extends PropsFromState {}

interface State {
  localizations: any;
  selectedLanguageSection: 'in-progress' | 'launched';
  showAll: boolean;
  showHelpTranslateModalFor: Locale;
  showLanguageRequestModal: boolean;
}

class LanguagesPage extends React.Component<Props, State> {
  state: State = {
    localizations: [],
    selectedLanguageSection: 'in-progress',
    showAll: false,
    showHelpTranslateModalFor: null,
    showLanguageRequestModal: false,
  };

  async componentDidMount() {
    this.setState({
      localizations: (await this.props.api.fetchPontoonLanguages()).data.project.localizations
        .map((localization: any) => ({
          ...localization,
          progress: localization.approvedStrings / localization.totalStrings,
        }))
        .sort(
          (l1: any, l2: any) =>
            l1.progress == l2.progress
              ? l1.locale.population < l2.locale.population
              : l1.progress < l2.progress
        ),
    });
  }

  toggleShowAll = () => this.setState(state => ({ showAll: !state.showAll }));

  render() {
    const {
      localizations,
      selectedLanguageSection,
      showAll,
      showHelpTranslateModalFor,
      showLanguageRequestModal,
    } = this.state;

    return (
      <div className={'selected-' + selectedLanguageSection}>
        {showHelpTranslateModalFor && (
          <HelpTranslateModal
            locale={this.state.showHelpTranslateModalFor}
            onRequestClose={() =>
              this.setState({ showHelpTranslateModalFor: null })
            }
          />
        )}

        <br />

        <div className="top">
          <img src="/img/waves-mixed.svg" alt="Waves" />

          <div className="text">
            <div className="inner">
              <h2>Don't see your language on Common Voice yet?</h2>
              <Button
                outline
                rounded
                onClick={() =>
                  this.setState({ showLanguageRequestModal: true })
                }>
                Request a Language
              </Button>
            </div>
          </div>
        </div>

        <br />

        {showLanguageRequestModal && (
          <RequestLanguageModal
            onRequestClose={() =>
              this.setState({ showLanguageRequestModal: false })
            }
          />
        )}

        <div className="mobile-headings">
          <Hr />

          <div className="labels">
            <h2
              className="in-progress"
              onClick={() =>
                this.setState({ selectedLanguageSection: 'in-progress' })
              }>
              In Progress
            </h2>
            <h2
              className="launched"
              onClick={() =>
                this.setState({
                  selectedLanguageSection: 'launched',
                  showAll: false,
                })
              }>
              Launched
            </h2>
          </div>
        </div>

        <div className="language-sections">
          <section className="in-progress">
            <div className="desktop-heading">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>In Progress</h1>

                <a
                  className="show-all-languages-desktop"
                  href="javascript:void(0)"
                  onClick={this.toggleShowAll}>
                  {showAll ? 'See Less' : 'See All'}
                </a>
              </div>

              <Hr />
            </div>

            <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
              {(showAll ? localizations : localizations.slice(0, 3)).map(
                (localization: any, i: number) => (
                  <LocalizationBox
                    key={i}
                    {...localization}
                    onShowHelpTranslateModal={locale =>
                      this.setState({ showHelpTranslateModalFor: locale })
                    }
                  />
                )
              )}
            </ul>

            <button
              className="show-all-languages-mobile"
              onClick={this.toggleShowAll}>
              {showAll ? 'See Less' : 'See All'}
            </button>
          </section>

          <section className="launched">
            <div className="desktop-heading">
              <h1>Launched</h1>

              <Hr />
            </div>

            <ul>
              <LocalizationBox
                locale={{
                  code: 'en',
                  name: 'English',
                  population: EN_POPULATION,
                }}
                progress={1}
              />
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(LanguagesPage);
