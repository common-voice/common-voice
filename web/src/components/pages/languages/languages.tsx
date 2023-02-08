import {
  Localized,
  ReactLocalization,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { BaseLanguage, LanguageStatistics } from 'common';

import { useAPI } from '../../../hooks/store-hooks';
import { useLocale, useNativeLocaleNames } from '../../locale-helpers';
import URLS from '../../../urls';
import { CloseIcon, SearchIcon } from '../../ui/icons';
import { LinkButton, StyledLink, TextButton } from '../../ui/ui';
import Page from '../../ui/page';
import PageHeading from '../../ui/page-heading';
import PageTextContent from '../../ui/page-text-content';

import LanguagesPageWaves from './languages-waves';
import LanguageCard from './language-card/language-card';
import LoadingLanguageCard from './language-card/loading-language-card';
import GetInvolvedModal from './get-involved-modal';

import './languages.css';

export interface ModalOptions {
  locale: string;
  l10n: ReactLocalization;
}
interface State {
  isLoading: boolean;
  inProgress: LanguageStatistics[];
  filteredInProgress: LanguageStatistics[];
  launched: LanguageStatistics[];
  filteredLaunched: LanguageStatistics[];
  localeMessages: string[][];
  showAllInProgress: boolean;
  showAllLaunched: boolean;
  query: string;
  modalOptions?: ModalOptions;
}

interface LanguageSearchProps {
  inputRef: { current: HTMLInputElement };
  query: string;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleQueryKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleSearch: () => void;
}

const LanguageSearch = ({
  inputRef,
  query,
  handleQueryChange,
  handleQueryKeyDown,
  toggleSearch,
}: LanguageSearchProps) => {
  return (
    <div className="search">
      <Localized id="language-search-input" attrs={{ placeholder: true }}>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleQueryKeyDown}
          ref={inputRef}
        />
      </Localized>
      {query ? (
        <TextButton onClick={toggleSearch} style={{ padding: 0 }}>
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
};

const LanguagesPage = ({ getString }: WithLocalizationProps) => {
  const [locale] = useLocale();
  const api = useAPI();
  const inputRef = React.createRef<HTMLInputElement>();
  const [state, setState] = useState({
    isLoading: true,
    inProgress: [],
    filteredInProgress: [],
    launched: [],
    filteredLaunched: [],
    localeMessages: null,
    showAllInProgress: false,
    showAllLaunched: false,
    query: '',
    modalOptions: null,
  } as State);

  const {
    isLoading,
    inProgress,
    filteredInProgress,
    launched,
    filteredLaunched,
    localeMessages,
    showAllInProgress,
    showAllLaunched,
    query,
    modalOptions,
  } = state;

  const loadData = async () => {
    const [localeMessages, languageStats] = await Promise.all([
      api.fetchCrossLocaleMessages(),
      api.fetchLanguageStats(),
    ]);

    const languageStatistics = languageStats ?? [];

    return { localeMessages, languageStatistics };
  };

  const sortLocales = () => {
    const newInProgress = inProgress.slice();
    const newLaunched = launched.slice();

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

    newInProgress.sort(
      presortLanguages((l1, l2) =>
        l1.sentencesCount.currentCount < l2.sentencesCount.currentCount ||
        l1.localizedPercentage < l2.localizedPercentage
          ? 1
          : -1
      )
    );
    newLaunched.sort(
      presortLanguages((l1, l2) =>
        l1.validatedHours < l2.validatedHours ? 1 : -1
      )
    );

    setState(previousState => ({
      ...previousState,
      inProgress: newInProgress,
      filteredInProgress: newInProgress,
      launched: newLaunched,
      filteredLaunched: newLaunched,
    }));
  };

  const toggleShowAllInProgress = () => {
    setState(previousState => ({
      ...previousState,
      showAllInProgress: !previousState.showAllInProgress,
    }));
  };

  const toggleShowAllLaunched = () => {
    setState(previousState => ({
      ...previousState,
      showAllLaunched: !previousState.showAllLaunched,
    }));
  };

  const toggleSearch = () => {
    setState(previousState => ({
      ...previousState,
      filteredInProgress: previousState.inProgress,
      filteredLaunched: previousState.launched,
      query: '',
    }));
  };

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    nativeNames: any
  ) => {
    const query = event.target.value;

    function filterLanguages<T>(languages: T[]): T[] {
      return query
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          languages.filter(({ locale }: any) => {
            const q = query.toLowerCase().trim();
            return (
              locale.includes(q) ||
              getString(locale).toLowerCase().includes(q) ||
              (nativeNames[locale] || '').toLowerCase().includes(q)
            );
          })
        : languages;
    }

    const filteredInProgress = filterLanguages(inProgress);
    const filteredLaunched = filterLanguages(launched);

    setState(previousState => ({
      ...previousState,
      filteredInProgress,
      filteredLaunched,
      query,
    }));
  };

  const handleQueryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      toggleSearch();
    }
  };

  const setModalOptions = (options: ModalOptions) => {
    setState(previousState => ({
      ...previousState,
      modalOptions: options,
    }));
  };

  const hideModal = () => {
    setState(previousState => ({
      ...previousState,
      modalOptions: null,
    }));
  };

  // on mount
  useEffect(() => {
    loadData().then(({ localeMessages, languageStatistics }) => {
      setState(previousState => ({
        ...previousState,
        isLoading: false,
        inProgress: languageStatistics.filter(
          (lang: LanguageStatistics) => !lang.is_contributable
        ),
        filteredInProgress: inProgress,
        launched: languageStatistics.filter(lang => lang.is_contributable),
        filteredLaunched: launched,
        localeMessages,
      }));
    });
  }, []);

  useEffect(() => {
    sortLocales();
  }, [locale, isLoading]);

  const descriptionElems = {
    localizationGlossaryLink: <StyledLink to={URLS.FAQ + '#localization'} />,
    sentenceCollectionGlossaryLink: (
      <StyledLink to={URLS.FAQ + '#sentence-collection'} />
    ),
    speakLink: <StyledLink to={URLS.SPEAK} />,
    listenLink: <StyledLink to={URLS.LISTEN} />,
  };

  const inProgressCountLabel = query && (
    <span className="count">({filteredInProgress.length})</span>
  );
  const launchedCountLabel = query && (
    <span className="count">({filteredLaunched.length})</span>
  );

  const launchedLanguages =
    query || showAllLaunched ? filteredLaunched : filteredLaunched.slice(0, 3);

  const inProgressLanguages =
    query || showAllInProgress
      ? filteredInProgress
      : filteredInProgress.slice(0, 3);
  const nativeNames = useNativeLocaleNames();

  return (
    <React.Fragment>
      {modalOptions && (
        <GetInvolvedModal
          locale={modalOptions.locale}
          l10n={modalOptions.l10n}
          onRequestClose={() => hideModal()}
        />
      )}
      <Page className="languages-page" isCentered>
        <LanguagesPageWaves />
        <div className="top">
          <PageHeading>Languages</PageHeading>
          <div className="text">
            <div className="inner">
              <p>
                <Localized id="request-language-text" />{' '}
              </p>
              <LinkButton outline rounded to={URLS.LANGUAGE_REQUEST}>
                <Localized id="request-language-button"></Localized>
              </LinkButton>
            </div>
          </div>
        </div>
        <div className="language-sections">
          <section className="launched">
            <div className="title-and-search">
              <LanguageSearch
                inputRef={inputRef}
                query={query}
                handleQueryChange={e => handleQueryChange(e, nativeNames)}
                handleQueryKeyDown={handleQueryKeyDown}
                toggleSearch={toggleSearch}
              />
              <h2 className="language-sections__heading">
                <Localized id="language-section-launched" />
                {launchedCountLabel}
              </h2>
            </div>
            <PageTextContent>
              <Localized
                id="language-section-launched-description"
                elems={descriptionElems}>
                <p />
              </Localized>
            </PageTextContent>
            <div className="languages-page__language-cards">
              {isLoading && (
                <>
                  <LoadingLanguageCard type="launched" />
                  <LoadingLanguageCard type="launched" />
                  <LoadingLanguageCard type="launched" />
                </>
              )}

              {!isLoading &&
                launchedLanguages.map(language => (
                  <LanguageCard
                    key={language.locale}
                    localeMessages={localeMessages}
                    type="launched"
                    language={language}
                  />
                ))}
            </div>

            {!query && (
              <Localized
                id={'languages-show-' + (showAllLaunched ? 'less' : 'more')}>
                <button
                  disabled={isLoading}
                  className="show-all-languages"
                  onClick={toggleShowAllLaunched}
                />
              </Localized>
            )}
          </section>

          <section className="in-progress">
            <h2 className="language-sections__heading">
              <Localized id="language-section-in-progress" />
              {inProgressCountLabel}
            </h2>

            <PageTextContent>
              <Localized
                id="language-section-in-progress-new-description"
                elems={descriptionElems}>
                <p />
              </Localized>
            </PageTextContent>
            <div className="languages-page__language-cards">
              {isLoading && (
                <>
                  <LoadingLanguageCard type="in-progress" />
                  <LoadingLanguageCard type="in-progress" />
                  <LoadingLanguageCard type="in-progress" />
                </>
              )}

              {!isLoading &&
                inProgressLanguages.map(language => (
                  <LanguageCard
                    key={language.locale}
                    localeMessages={localeMessages}
                    type="in-progress"
                    language={language}
                    setModalOptions={setModalOptions}
                  />
                ))}
            </div>

            {!query && (
              <Localized
                id={'languages-show-' + (showAllInProgress ? 'less' : 'more')}>
                <button
                  disabled={isLoading}
                  className="show-all-languages"
                  onClick={toggleShowAllInProgress}
                />
              </Localized>
            )}
          </section>
        </div>
      </Page>
    </React.Fragment>
  );
};

export default withLocalization(LanguagesPage);
