import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { Button, Hr } from '../../ui/ui';
import LocalizationBox from './localization-box';
const EN_POPULATION = 1522575000;

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {}

interface State {
  localizations: any;
  selectedLanguageSection: 'in-progress' | 'launched';
  showAll: boolean;
  showLanguageRequestModal: boolean;
}

class LanguagesPage extends React.Component<Props, State> {
  state: State = {
    localizations: [],
    selectedLanguageSection: 'in-progress',
    showAll: false,
    showLanguageRequestModal: false,
  };

  async componentDidMount() {
    const { api } = this.props;

    // By fetching those messages early, we reduce the delay for showing the complete LocalizationBox
    api.fetchCrossLocaleMessages().catch(e => console.error(e));

    this.setState({
      localizations: (await api.fetchPontoonLanguages()).data.project.localizations
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
      showLanguageRequestModal,
    } = this.state;

    return (
      <div className={'selected-' + selectedLanguageSection}>
        <br />

        <div className="top">
          <div className="waves">
            <img src="/img/waves/_1.svg" />
            <img src="/img/waves/_2.svg" />
            <img src="/img/waves/_3.svg" className="red" />

            <img src="/img/waves/fading.svg" style={{ right: -5 }} />
            <img src="/img/waves/Eq.svg" className="eq" />
          </div>

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
            <div className="md-block">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>In Progress</h1>

                <a
                  className="show-all-languages-md"
                  href="javascript:void(0)"
                  onClick={this.toggleShowAll}>
                  {showAll ? 'See Less' : 'See More'}
                </a>
              </div>

              <Hr />
            </div>

            <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
              {(showAll ? localizations : localizations.slice(0, 3)).map(
                (localization: any, i: number) => (
                  <LocalizationBox key={i} showCTA {...localization} />
                )
              )}
            </ul>

            <button
              className="show-all-languages-mobile"
              onClick={this.toggleShowAll}>
              {showAll ? 'See Less' : 'See More'}
            </button>
          </section>

          <section className="launched">
            <div className="md-block">
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
