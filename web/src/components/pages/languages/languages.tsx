import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
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
  <div style={{ width: '33%' }}>
    <h2>{locale.name}</h2>
    <b>Population: </b>
    {locale.population.toLocaleString()}
    <br />
    <b>Translated:</b> {Math.round(progress * 100)}%
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
}

class LanguagesPage extends React.Component<Props, State> {
  state: State = {
    localizations: [],
    showAll: false,
    showHelpTranslateModalFor: null,
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
    const { localizations, showAll, showHelpTranslateModalFor } = this.state;

    return (
      <React.Fragment>
        {showHelpTranslateModalFor && (
          <HelpTranslateModal
            locale={this.state.showHelpTranslateModalFor}
            onRequestClose={() =>
              this.setState({ showHelpTranslateModalFor: null })
            }
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>In Progress</h1>
          {!showAll && (
            <button onClick={() => this.setState({ showAll: true })}>
              See All
            </button>
          )}
        </div>
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

        <div>
          <h1>Launched</h1>
          <LocalizationBox
            locale={{ code: 'en', name: 'English', population: EN_POPULATION }}
            progress={1}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(LanguagesPage);
