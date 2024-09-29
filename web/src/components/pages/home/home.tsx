import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { trackHome } from '../../../services/tracker';
import { useTypedSelector } from '../../../stores/tree';
import { ContributableLocaleLock } from '../../locale-helpers';
import { RecordLink } from '../../primary-buttons/primary-buttons';
import RegisterSection from '../../register-section/register-section';
import { LinkButton } from '../../ui/ui';
import Page from '../../ui/page';
import Hero from './hero';
import { ClipsStats, VoiceStats } from './stats';
import URLS from '../../../urls';

import './home.css';
import LanguageCard from '../languages/language-card/language-card';
import { useAPI } from '../../../hooks/store-hooks';
import { LanguageStatistics } from 'common';
import { ModalOptions } from '../languages/languages';
import HomePageSection from './HomePageSection';
import Charts from './Charts';
import FAQList from './FAQList';

type HeroType = 'speak' | 'listen';

interface State {
  launched: LanguageStatistics[];
  localeMessages: string[][];
}

export default function HomePage() {
  const heroes = ['speak', 'listen'];

  const { locale, user } = useTypedSelector(
    ({ locale, user }) => ({
      locale,
      user,
    }),
    shallowEqual
  );

  const [activeHero, setActiveHero] = useState<null | HeroType>(null);
  const [showWallOfText, setShowWallOfText] = useState(false);

  const setModalOptions = (options: ModalOptions) => {
    setState(previousState => ({
      ...previousState,
      modalOptions: options,
    }));
  };

  const [state, setState] = useState({
    launched: [],
    localeMessages: null,
  } as State);

  const {
    launched,
    localeMessages,
  } = state;

  const api = useAPI();

  const loadData = async () => {
    const [localeMessages, languageStats] = await Promise.all([
      api.fetchCrossLocaleMessages(),
      api.fetchLanguageStats(),
    ]);

    const languageStatistics = languageStats ?? [];

    return { localeMessages, languageStatistics };
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
        launched: languageStatistics.filter(lang => lang.is_contributable && lang.locale == 'ar'),
        filteredLaunched: launched,
        localeMessages,
      }));
    });
  }, []);


  return (
    <Page className="home">
      <ContributableLocaleLock
        render={({ isContributable }: { isContributable: boolean }) =>
          isContributable ? (
            // <div
            //   className={
            //     'heroes ' + (heroes.length > 1 ? 'multiple' : 'single')
            //   }>
                 <div>
              {/* {heroes.map((type: HeroType) => (
                <Hero
                  key={type + locale}
                  type={type}
                  status={
                    heroes.length == 1 || activeHero === type
                      ? 'active'
                      : activeHero
                      ? 'compressed'
                      : null
                  }
                  onShow={() => setActiveHero(type)}
                  onHide={() =>
                    setActiveHero(activeHero === type ? null : activeHero)
                  }
                />
              ))} */}
              <HomePageSection/>
            </div>
          ) : (
            <div className="non-contributable-hero">
              <img
                className="fading"
                src={require('./images/fading.svg')}
                alt="Fading"
              />
              <img
                className="waves"
                src={require('./images/speak.svg')}
                alt="Waves"
              />
            </div>
          )
        }
      />

      {/* <div className="text">
        <div className="inner">
          <div className="title">
            <h1>
              <Localized id="default-tagline" />
            </h1>
          </div>

          <div className="description">
            <Localized id="wall-of-text-first">
              <p />
            </Localized>

            <br />

            <Localized id="wall-of-text-second">
              <p />
            </Localized>

            <br />

            {showWallOfText && (
              <>
                <Localized id="wall-of-text-more-desktop">
                  <p />
                </Localized>
                <br />
              </>
            )}

            <Localized
              id={showWallOfText ? 'languages-show-less' : 'show-wall-of-text'}>
              <button
                className="show-more"
                type="button"
                onClick={() => {
                  if (showWallOfText) {
                    trackHome('read-more', locale);
                  }
                  setShowWallOfText(!showWallOfText);
                }}
              />
            </Localized>
          </div>
        </div>
      </div> 
      */}

     {/* <div className="stats">
        <ClipsStats.Root />
        <VoiceStats />
      </div>  */}

    <div className='my-[100px]  px-10 flex justify-evenly flex-wrap gap-y-10	'>
      {/* <Charts/> */}
      <ClipsStats.Root />
      <VoiceStats />
      </div>

{/* الأسئلة الشائعة */}
<FAQList/>

      {user.account ? (
        <section className="contribute-section">
          <div className="mars-container">
            {/* <img src="/img/mars.svg" alt="Mars" /> */}
              {launched.map(language => (
                <LanguageCard
                  key={language.locale}
                  localeMessages={localeMessages}
                  type="launched"
                  language={language}
                  setModalOptions={setModalOptions}
                />
              ))}
          </div>
          <div className="cta">
            <ContributableLocaleLock
              render={({ isContributable }: { isContributable: boolean }) =>
                isContributable ? (
                  <>
                    <RecordLink
                      onClick={() => trackHome('speak-mars', locale)}
                    />
                    <h1>
                      <Localized id="ready-to-record" />
                    </h1>
                  </>
                ) : (
                  <>
                    <h1>
                      <Localized id="request-language-text" />
                    </h1>
                    <div style={{ width: '100%' }} />
                    <Localized id="request-language-button">
                      <LinkButton
                        type="button"
                        className="request-language"
                        to={URLS.LANGUAGE_REQUEST}
                      />
                    </Localized>
                  </>
                )
              }
            />
          </div>
        </section>
      ) : (
        <div></div>
        // <RegisterSection marsSrc="/img/mars.svg">
        //   <h1>
        //     <Localized id="help-make-dataset" />
        //   </h1>
        //   <h2>
        //     <Localized id="profile-not-required" />
        //   </h2>
        //   <Localized id="sign-up-account">
        //     <LinkButton
        //       rounded
        //       href="/login"
        //       onClick={() => trackHome('click-benefits-register', locale)}
        //     />
        //   </Localized>
        // </RegisterSection>
      )}
    </Page>
  );
}
