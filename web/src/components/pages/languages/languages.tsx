import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  BaseLanguage,
  InProgressLanguage,
  LaunchedLanguage,
} from 'common/language-stats';
import API from '../../../services/api';
import { NATIVE_NAMES } from '../../../services/localization';
import { trackLanguages } from '../../../services/tracker';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import URLS from '../../../urls';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { CloseIcon, SearchIcon } from '../../ui/icons';
import { Button, Hr, StyledLink, TextButton } from '../../ui/ui';
import LocalizationBox, { LoadingLocalizationBox } from './localization-box';

interface PropsFromState {
  api: API;
  locale: Locale.State;
}

interface Props extends PropsFromState, LocalizationProps {}

type LanguageSection = 'in-progress' | 'launched';

interface State {
  inProgress: InProgressLanguage[];
  filteredInProgress: InProgressLanguage[];
  launched: LaunchedLanguage[];
  filteredLaunched: LaunchedLanguage[];
  localeMessages: string[][];
  selectedSection: LanguageSection;
  showAllInProgress: boolean;
  showAllLaunched: boolean;
  showLanguageRequestModal: boolean;
  query: string;
}

class LanguagesPage extends React.PureComponent<Props, State> {
  state: State = {
    inProgress: [],
    filteredInProgress: [],
    launched: [],
    filteredLaunched: [],
    localeMessages: null,
    selectedSection: 'launched',
    showAllInProgress: false,
    showAllLaunched: false,
    showLanguageRequestModal: false,
    query: '',
  };

  smallSearchInputRef = React.createRef<HTMLInputElement>();
  largeSearchInputRef = React.createRef<HTMLInputElement>();

  async componentDidMount() {
    const { api } = this.props;

    const [localeMessages, { launched, inProgress }] = await Promise.all([
      api.fetchCrossLocaleMessages(),
      api.fetchLanguageStats(),
    ]);

    this.setState(
      {
        inProgress,
        filteredInProgress: inProgress,
        launched,
        filteredLaunched: launched,
        localeMessages,
      },
      this.sortLocales
    );
  }

  componentDidUpdate({ locale }: Props) {
    if (this.props.locale !== locale) {
      this.sortLocales();
    }
  }

  sortLocales = () => {
    const { locale } = this.props;
    const inProgress = this.state.inProgress.slice();
    const launched = this.state.launched.slice();

    function presortLanguages<T extends BaseLanguage>(
      sortFn: (l1: T, l2: T) => number
    ): (l1: T, l2: T) => number {
      return (l1, l2) => {
        // Selected locale comes first
        if (l1.locale === locale) {
          return -1;
        }
        if (l2.locale === locale) {
          return 1;
        }

        // English comes last
        if (l1.locale === 'en') {
          return 1;
        }
        if (l2.locale === 'en') {
          return -1;
        }

        // Browser locales are prioritized as well
        if (navigator.languages.includes(l1.locale)) {
          return -1;
        }
        if (navigator.languages.includes(l2.locale)) {
          return 1;
        }
        return sortFn(l1, l2);
      };
    }

    inProgress.sort(
      presortLanguages((l1, l2) =>
        l1.sentencesCount < l2.sentencesCount ||
        l1.localizedPercentage < l2.localizedPercentage
          ? 1
          : -1
      )
    );
    launched.sort(
      presortLanguages((l1, l2) => (l1.seconds < l2.seconds ? 1 : -1))
    );

    this.setState({
      inProgress,
      filteredInProgress: inProgress,
      launched,
      filteredLaunched: launched,
    });
  };

  toggleShowAllInProgress = () => {
    this.setState(state => {
      const showAllInProgress = !state.showAllInProgress;
      trackLanguages(
        showAllInProgress ? 'see-more' : 'see-less',
        this.props.locale
      );
      return { showAllInProgress };
    });
  };

  toggleShowAllLaunched = () => {
    this.setState(state => {
      const showAllLaunched = !state.showAllLaunched;
      trackLanguages(
        showAllLaunched ? 'see-more' : 'see-less',
        this.props.locale
      );
      return { showAllLaunched };
    });
  };

  toggleSearch = () =>
    this.setState(({ inProgress, launched }) => ({
      filteredInProgress: inProgress,
      filteredLaunched: launched,
      query: '',
    }));

  changeSection = (section: LanguageSection) => {
    this.setState({
      selectedSection: section,
      showAllInProgress: false,
      showAllLaunched: false,
    });
  };

  handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { getString } = this.props;
    const { inProgress, launched, selectedSection } = this.state;
    const query = event.target.value;

    function filterLanguages<T>(languages: T[]): T[] {
      return query
        ? languages.filter(({ locale }: any) => {
            const q = query.toLowerCase();
            return (
              locale.includes(q) ||
              getString(locale)
                .toLowerCase()
                .includes(q) ||
              (NATIVE_NAMES[locale] || '').toLowerCase().includes(q)
            );
          })
        : languages;
    }

    const filteredInProgress = filterLanguages(inProgress);
    const filteredLaunched = filterLanguages(launched);
    this.setState({
      filteredInProgress: filteredInProgress,
      filteredLaunched: filteredLaunched,
      query,
      selectedSection:
        filteredInProgress.length == 0
          ? 'launched'
          : filteredLaunched.length == 0
          ? 'in-progress'
          : selectedSection,
    });
  };

  handleQueryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      this.toggleSearch();
    }
  };

  render() {
    const { getString } = this.props;
    const {
      inProgress,
      filteredInProgress,
      launched,
      filteredLaunched,
      localeMessages,
      selectedSection,
      showAllInProgress,
      showAllLaunched,
      showLanguageRequestModal,
      query,
    } = this.state;

    const descriptionProps = {
      localizationGlossaryLink: <StyledLink to={URLS.FAQ + '#localization'} />,
      sentenceCollectionGlossaryLink: (
        <StyledLink to={URLS.FAQ + '#sentence-collection'} />
      ),
      speakLink: <StyledLink to={URLS.SPEAK} />,
      listenLink: <StyledLink to={URLS.LISTEN} />,
    };

    const inProgressCountLabel = query ? (
      <span className="count">({filteredInProgress.length})</span>
    ) : (
      ''
    );
    const launchedCountLabel = query ? (
      <span className="count">({filteredLaunched.length})</span>
    ) : (
      ''
    );

    return (
      <div className={'selected-' + selectedSection}>
        <br />

        <div className="top">
          <div className="waves">
            <img src={require('./images/_1.svg')} />
            <img src={require('./images/_2.svg')} />
            <img src={require('./images/_3.svg')} className="red" />

            <img src={require('./images/fading.svg')} style={{ right: -5 }} />
            <img src={require('./images/Eq.svg')} className="eq" />
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
                  onClick={() => {
                    trackLanguages(
                      'open-request-language-modal',
                      this.props.locale
                    );
                    this.setState({ showLanguageRequestModal: true });
                  }}
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
            <h2
              className="launched"
              onClick={this.changeSection.bind(this, 'launched')}>
              {getString('language-section-launched')}
              {launchedCountLabel}
            </h2>

            <h2
              className="in-progress"
              onClick={this.changeSection.bind(this, 'in-progress')}>
              {getString('language-section-in-progress')}
              {inProgressCountLabel}
            </h2>
          </div>

          {this.renderSearch(this.smallSearchInputRef)}
        </div>

        <div className="language-sections">
          <section className="launched">
            <div className="title-and-search">
              <h1>
                {getString('language-section-launched')}
                {launchedCountLabel}
              </h1>
              {this.renderSearch(this.largeSearchInputRef)}
              <Hr />
            </div>

            <Localized
              id="language-section-launched-description"
              {...descriptionProps}>
              <p />
            </Localized>
            <ul>
              {launched.length > 0
                ? (query || showAllLaunched
                    ? filteredLaunched
                    : filteredLaunched.slice(0, 3)
                  ).map((localization, i) => (
                    <LocalizationBox
                      key={localization.locale}
                      localeMessages={localeMessages}
                      type="launched"
                      {...localization}
                    />
                  ))
                : [1, 2, 3].map((n, i) => <LoadingLocalizationBox key={i} />)}
            </ul>

            {!query && (
              <Localized
                id={'languages-show-' + (showAllLaunched ? 'less' : 'more')}>
                <button
                  disabled={launched.length === 0}
                  className="show-all-languages"
                  onClick={this.toggleShowAllLaunched}
                />
              </Localized>
            )}
          </section>

          <section className="in-progress">
            <div className="md-block">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h1 style={{ marginRight: '1.5rem' }}>
                  {getString('language-section-in-progress')}
                  {inProgressCountLabel}
                </h1>
              </div>
              <Hr />
            </div>

            <Localized
              id="language-section-in-progress-new-description"
              {...descriptionProps}>
              <p />
            </Localized>
            <ul>
              {inProgress.length > 0
                ? (query || showAllInProgress
                    ? filteredInProgress
                    : filteredInProgress.slice(0, 3)
                  ).map((localization, i) => (
                    <LocalizationBox
                      key={localization.locale}
                      localeMessages={localeMessages}
                      type="in-progress"
                      {...localization}
                    />
                  ))
                : [1, 2, 3].map(i => <LoadingLocalizationBox key={i} />)}
            </ul>

            {!query && (
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

  renderSearch(inputRef: { current: null | HTMLInputElement }) {
    const { query } = this.state;
    return (
      <div className="search">
        <Localized id="language-search-input" attrs={{ placeholder: true }}>
          <input
            type="text"
            value={query}
            onChange={this.handleQueryChange}
            onKeyDown={this.handleQueryKeyDown}
            ref={inputRef}
          />
        </Localized>
        {query ? (
          <TextButton onClick={this.toggleSearch} style={{ padding: 0 }}>
            <CloseIcon
              black
              style={{
                marginTop: 2,
                marginRight: 8,
                padding: 4,
                boxSizing: 'border-box',
              }}
            />
          </TextButton>
        ) : (
          <TextButton onClick={() => inputRef.current.focus()}>
            <SearchIcon />
          </TextButton>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ api, locale }: StateTree) => ({
  api,
  locale,
});

export default connect<PropsFromState>(mapStateToProps)(
  withLocalization(LanguagesPage)
);
