import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { Button, Hr } from '../../ui/ui';
import LocalizationBox, { LoadingLocalizationBox } from './localization-box';

const ENGLISH_LOCALE = {
  code: 'en',
  name: 'English',
  population: 1522575000,
};

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {}

interface State {
  localeMessages: string[][];
  localizations: any;
  selectedLanguageSection: 'in-progress' | 'launched';
  showAll: boolean;
  showLanguageRequestModal: boolean;
}

class LanguagesPage extends React.PureComponent<Props, State> {
  state: State = {
    localeMessages: null,
    localizations: [],
    selectedLanguageSection: 'in-progress',
    showAll: false,
    showLanguageRequestModal: false,
  };

  async componentDidMount() {
    const { api } = this.props;

    const [localeMessages, pontoonLanguages] = await Promise.all([
      api.fetchCrossLocaleMessages(),
      api.fetchPontoonLanguages(),
    ]);

    this.setState({
      localeMessages,
      localizations: pontoonLanguages.data.project.localizations
        .map((localization: any) => ({
          ...localization,
          progress:
            0.5 * (localization.approvedStrings / localization.totalStrings),
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
      localeMessages,
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
              <Localized id="request-language-text">
                <h2 />
              </Localized>
              <Localized id="request-language-button">
                <Button
                  outline
                  rounded
                  onClick={() =>
                    this.setState({ showLanguageRequestModal: true })
                  }
                />
              </Localized>
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
            <Localized id="language-section-in-progress">
              <h2
                className="in-progress"
                onClick={() =>
                  this.setState({ selectedLanguageSection: 'in-progress' })
                }
              />
            </Localized>

            <Localized id="language-section-launched">
              <h2
                className="launched"
                onClick={() =>
                  this.setState({
                    selectedLanguageSection: 'launched',
                    showAll: false,
                  })
                }
              />
            </Localized>
          </div>
        </div>

        <div className="language-sections">
          <section className="in-progress">
            <div className="md-block">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Localized id="language-section-in-progress">
                  <h1 />
                </Localized>
              </div>

              <Hr />
            </div>

            <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
              {localizations.length > 0
                ? (showAll ? localizations : localizations.slice(0, 3)).map(
                    (localization: any, i: number) => (
                      <LocalizationBox
                        key={i}
                        localeMessages={localeMessages}
                        showCTA
                        {...localization}
                      />
                    )
                  )
                : [1, 2, 3].map(i => <LoadingLocalizationBox key={i} />)}
            </ul>

            <Localized id={'languages-show-' + (showAll ? 'less' : 'more')}>
              <button
                disabled={localizations.length === 0}
                className="show-all-languages"
                onClick={this.toggleShowAll}
              />
            </Localized>
          </section>

          <section className="launched">
            <div className="md-block">
              <Localized id="language-section-launched">
                <h1 />
              </Localized>

              <Hr />
            </div>

            <ul>
              <LocalizationBox
                locale={ENGLISH_LOCALE}
                localeMessages={localeMessages}
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
