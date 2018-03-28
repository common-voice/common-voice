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
  <div className="language">
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
        Help Translate!
      </button>
    )}
  </div>
);

interface Props extends PropsFromState {}

interface State {
  localizations: any;
  showAll: boolean;
  showHelpTranslateModalFor: Locale;
  showLanguageRequestModal: boolean;
}

class LanguagesPage extends React.Component<Props, State> {
  state: State = {
    localizations: [],
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

  render() {
    const {
      localizations,
      showAll,
      showHelpTranslateModalFor,
      showLanguageRequestModal,
    } = this.state;

    return (
      <div>
        {showHelpTranslateModalFor && (
          <HelpTranslateModal
            locale={this.state.showHelpTranslateModalFor}
            onRequestClose={() =>
              this.setState({ showHelpTranslateModalFor: null })
            }
          />
        )}

        <br />

        <div>
          Don't see your language on Common Voice yet?
          <br />
          <Button
            rounded
            onClick={() => this.setState({ showLanguageRequestModal: true })}>
            Request a Language
          </Button>
        </div>

        <br />

        {showLanguageRequestModal && (
          <RequestLanguageModal
            onRequestClose={() =>
              this.setState({ showLanguageRequestModal: false })
            }
          />
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>In Progress</h1>

            {!showAll && (
              <a
                className="show-all-languages"
                href="javascript:void(0)"
                onClick={() => this.setState({ showAll: true })}>
                See All
              </a>
            )}
          </div>

          <Hr />

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
          </div>
        </div>

        <br />
        <br />

        <div>
          <h1>Launched</h1>

          <Hr />

          <LocalizationBox
            locale={{ code: 'en', name: 'English', population: EN_POPULATION }}
            progress={1}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(LanguagesPage);
