import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import { isProduction } from '../../../utility';
import StateTree from '../../../stores/tree';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { CloseIcon, SearchIcon } from '../../ui/icons';
import { Button, Hr, TextButton } from '../../ui/ui';
import LocalizationBox, { LoadingLocalizationBox } from './localization-box';
import { getNativeNameWithFallback } from '../../../services/localization';
import { contributableLocales, isContributable } from '../../locale-helpers';

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {}

type LanguageSection = 'in-progress' | 'launched';

interface State {
  inProgress: any;
  launched: any;
  localeMessages: string[][];
  selectedSection: LanguageSection;
  showAllInProgress: boolean;
  showAllLaunched: boolean;
  showLanguageRequestModal: boolean;
  showSearch: boolean;
  query: string;
}

class LanguagesPage extends React.PureComponent<Props, State> {
  state: State = {
    inProgress: [],
    launched: [],
    localeMessages: null,
    selectedSection: 'launched',
    showAllInProgress: false,
    showAllLaunched: false,
    showLanguageRequestModal: false,
    showSearch: false,
    query: '',
  };

  searchInputRef = React.createRef<HTMLInputElement>();

  async componentDidMount() {
    const { api } = this.props;

    const [localeMessages, pontoonLanguages] = await Promise.all([
      api.fetchCrossLocaleMessages(),
      api.fetchPontoonLanguages(),
    ]);

    const localizations = pontoonLanguages.data.project.localizations
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
      );

    const [launched, inProgress] = localizations.reduce(
      ([launched, inProgress]: any, localization: any) =>
        isContributable(localization.locale.code)
          ? [[...launched, localization], inProgress]
          : [launched, [...inProgress, localization]],
      [[], []]
    );

    this.setState({
      inProgress,
      launched: [
        ...launched,
        {
          locale: {
            code: 'en',
            name: 'English',
            population: 1522575000,
          },
          progress: 0.5,
        },
      ],
      localeMessages,
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.showSearch && !prevState.showSearch) {
      this.searchInputRef.current.focus();
    }
  }

  toggleShowAllInProgress = () =>
    this.setState(state => ({ showAllInProgress: !state.showAllInProgress }));

  toggleShowAllLaunched = () =>
    this.setState(state => ({ showAllLaunched: !state.showAllLaunched }));

  toggleSearch = () =>
    this.setState(state => ({ showSearch: !state.showSearch, query: '' }));

  changeSection = (section: LanguageSection) => {
    this.setState({
      selectedSection: section,
      showAllInProgress: false,
      showAllLaunched: false,
    });
  };

  handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value });
  };

  handleQueryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') this.toggleSearch();
  };

  render() {
    const {
      inProgress,
      launched,
      localeMessages,
      selectedSection,
      showAllInProgress,
      showAllLaunched,
      showLanguageRequestModal,
      showSearch,
      query,
    } = this.state;

    const filteredInProgress =
      showSearch && query
        ? inProgress.filter(({ locale: { code, name } }: any) => {
            const q = query.toLowerCase();
            return (
              name.toLowerCase().includes(q) ||
              getNativeNameWithFallback(code)
                .toLowerCase()
                .includes(q)
            );
          })
        : showAllInProgress ? inProgress : inProgress.slice(0, 3);

    return (
      <div className={'selected-' + selectedSection}>
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

        {!showSearch && (
          <div className="mobile-headings">
            <Hr />

            <div className="labels">
              <Localized id="language-section-launched">
                <h2
                  className="launched"
                  onClick={this.changeSection.bind(this, 'launched')}
                />
              </Localized>

              <Localized id="language-section-in-progress">
                <h2
                  className="in-progress"
                  onClick={this.changeSection.bind(this, 'in-progress')}
                />
              </Localized>

              {!isProduction() && (
                <TextButton onClick={this.toggleSearch}>
                  <SearchIcon />
                </TextButton>
              )}
            </div>
          </div>
        )}

        {showSearch && (
          <React.Fragment>
            <div className="search">
              <Localized
                id="language-search-input"
                attrs={{ placeholder: true }}>
                <input
                  type="text"
                  value={query}
                  onChange={this.handleQueryChange}
                  onKeyDown={this.handleQueryKeyDown}
                  ref={this.searchInputRef}
                />
              </Localized>
              <TextButton onClick={this.toggleSearch}>
                <CloseIcon black />
              </TextButton>
            </div>
            <Hr />
          </React.Fragment>
        )}

        <div className="language-sections">
          {!showSearch && (
            <section className="launched">
              <div className="md-block">
                <Localized id="language-section-launched">
                  <h1 />
                </Localized>

                <Hr />
              </div>

              <Localized
                id="language-section-launched-description"
                italic={<i />}>
                <p />
              </Localized>
              <ul>
                {launched.length > 0
                  ? (showAllLaunched ? launched : launched.slice(0, 3)).map(
                      (localization: any, i: number) => (
                        <LocalizationBox
                          key={i}
                          localeMessages={localeMessages}
                          type="launched"
                          {...{ localization }}
                        />
                      )
                    )
                  : [1, 2, 3].map((n, i) => <LoadingLocalizationBox key={i} />)}
              </ul>

              <Localized
                id={'languages-show-' + (showAllLaunched ? 'less' : 'more')}>
                <button
                  disabled={launched.length === 0}
                  className="show-all-languages"
                  onClick={this.toggleShowAllLaunched}
                />
              </Localized>
            </section>
          )}

          <section
            className="in-progress"
            style={showSearch ? { marginTop: 0 } : {}}>
            {!showSearch && (
              <div className="md-block">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Localized id="language-section-in-progress">
                    <h1 style={{ marginRight: '1.5rem' }} />
                  </Localized>
                  {!isProduction() && (
                    <TextButton onClick={this.toggleSearch}>
                      <SearchIcon />
                    </TextButton>
                  )}
                </div>
                <Hr />
              </div>
            )}

            <Localized id="language-section-in-progress-description">
              <p />
            </Localized>
            <ul>
              {inProgress.length > 0
                ? filteredInProgress.map((localization: any, i: number) => (
                    <LocalizationBox
                      key={i}
                      localeMessages={localeMessages}
                      type="in-progress"
                      {...{ localization }}
                    />
                  ))
                : [1, 2, 3].map(i => <LoadingLocalizationBox key={i} />)}
            </ul>

            {!showSearch && (
              <Localized
                id={'languages-show-' + (showAllInProgress ? 'less' : 'more')}>
                <button
                  disabled={inProgress.length === 0}
                  className="show-all-languages"
                  onClick={this.toggleShowAllInProgress}
                />
              </Localized>
            )}
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
