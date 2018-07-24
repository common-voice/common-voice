import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import {
  InProgressLanguage,
  LaunchedLanguage,
} from '../../../../../common/language-stats';
import { getNativeNameWithFallback } from '../../../services/localization';
import StateTree from '../../../stores/tree';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { CloseIcon, SearchIcon } from '../../ui/icons';
import { Button, Hr, TextButton } from '../../ui/ui';
import LocalizationBox, { LoadingLocalizationBox } from './localization-box';

interface PropsFromState {
  api: API;
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

    inProgress.sort(
      (l1, l2) => (l1.localizedPercentage < l2.localizedPercentage ? 1 : -1)
    );
    launched.sort(
      (l1, l2) => (l1.locale.code === 'en' || l1.hours < l2.hours ? 1 : -1)
    );

    this.setState({
      inProgress,
      filteredInProgress: inProgress,
      launched,
      filteredLaunched: launched,
      localeMessages,
    });
  }

  toggleShowAllInProgress = () =>
    this.setState(state => ({ showAllInProgress: !state.showAllInProgress }));

  toggleShowAllLaunched = () =>
    this.setState(state => ({ showAllLaunched: !state.showAllLaunched }));

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
    const { inProgress, launched, selectedSection } = this.state;
    const query = event.target.value;

    function filterLanguages<T>(languages: T[]): T[] {
      return query
        ? languages.filter(({ locale: { code, name } }: any) => {
            const q = query.toLowerCase();
            return (
              name.toLowerCase().includes(q) ||
              getNativeNameWithFallback(code)
                .toLowerCase()
                .includes(q)
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
          : filteredLaunched.length == 0 ? 'in-progress' : selectedSection,
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
              italic={<i />}>
              <p />
            </Localized>
            <ul>
              {launched.length > 0
                ? (query || showAllLaunched
                    ? filteredLaunched
                    : filteredLaunched.slice(0, 3)
                  ).map((localization, i) => (
                    <LocalizationBox
                      key={i}
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

            <Localized id="language-section-in-progress-description">
              <p />
            </Localized>
            <ul>
              {inProgress.length > 0
                ? (query || showAllInProgress
                    ? filteredInProgress
                    : filteredInProgress.slice(0, 3)
                  ).map((localization, i) => (
                    <LocalizationBox
                      key={i}
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

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(
  withLocalization(LanguagesPage)
);
