import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { CloseIcon, SearchIcon } from '../../ui/icons';
import { Button, Hr } from '../../ui/ui';
import LocalizationBox, { LoadingLocalizationBox } from './localization-box';
import { getNativeNameWithFallback } from '../../../services/localization';

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
  showSearch: boolean;
  query: string;
}

class LanguagesPage extends React.PureComponent<Props, State> {
  state: State = {
    localeMessages: null,
    localizations: [],
    selectedLanguageSection: 'in-progress',
    showAll: false,
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.showSearch && !prevState.showSearch) {
      this.searchInputRef.current.focus();
    }
  }

  toggleShowAll = () => this.setState(state => ({ showAll: !state.showAll }));

  toggleSearch = () =>
    this.setState(state => ({ showSearch: !state.showSearch, query: '' }));

  handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value });
  };

  handleQueryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') this.toggleSearch();
  };

  render() {
    const {
      localeMessages,
      localizations,
      selectedLanguageSection,
      showAll,
      showLanguageRequestModal,
      showSearch,
      query,
    } = this.state;

    const filteredLocalizations =
      showSearch && query
        ? localizations.filter(({ locale: { code, name } }: any) => {
            const q = query.toLowerCase();
            return (
              name.toLowerCase().includes(q) ||
              getNativeNameWithFallback(code)
                .toLowerCase()
                .includes(q)
            );
          })
        : showAll ? localizations : localizations.slice(0, 3);

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

        {!showSearch && (
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

              <a href="#" onClick={this.toggleSearch}>
                <SearchIcon />
              </a>
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
              <a href="#" onClick={this.toggleSearch}>
                <CloseIcon black />
              </a>
            </div>
            <Hr />
          </React.Fragment>
        )}

        <div className="language-sections">
          <section
            className="in-progress"
            style={showSearch ? { marginTop: 0 } : {}}>
            {!showSearch && (
              <div className="md-block">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Localized id="language-section-in-progress">
                    <h1 style={{ marginRight: '1.5rem' }} />
                  </Localized>
                  <a href="#" onClick={this.toggleSearch}>
                    <SearchIcon />
                  </a>
                </div>
                <Hr />
              </div>
            )}

            <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
              {localizations.length > 0
                ? filteredLocalizations.map((localization: any, i: number) => (
                    <LocalizationBox
                      key={i}
                      localeMessages={localeMessages}
                      showCTA
                      {...localization}
                    />
                  ))
                : [1, 2, 3].map(i => <LoadingLocalizationBox key={i} />)}
            </ul>

            {!showSearch && (
              <Localized id={'languages-show-' + (showAll ? 'less' : 'more')}>
                <button
                  disabled={localizations.length === 0}
                  className="show-all-languages"
                  onClick={this.toggleShowAll}
                />
              </Localized>
            )}
          </section>

          {!showSearch && (
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
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(LanguagesPage);
