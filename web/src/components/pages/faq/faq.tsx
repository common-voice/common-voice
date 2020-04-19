import * as React from 'react';
import { useState } from 'react';
import * as cx from 'classnames';
import { isMobileResolution } from '../../../utility';
import { LocalizedGetAttribute } from '../../locale-helpers';
import { SearchIconCode, ChevronDown } from '../../ui/icons';
import useActiveSection from '../../../hooks/use-active-section';
import { faqSearchSelector, FaqSection, SECTIONS } from './selectors';
import {
  Localized,
  LocalizationProps,
  withLocalization,
} from 'fluent-react/compat';

const throttle = require('lodash.throttle');

import './faq.css';

type SectionProps = {
  section: FaqSection;
  activeQuestions: string[];
  setActiveQuestion: (question: string) => void;
};

const Section: React.ComponentType<SectionProps> = React.memo(
  ({ section, activeQuestions, setActiveQuestion }: SectionProps) => (
    <div id={section.key} className="faq-q-and-a">
      {section.content.map(([question, answers, props]) => {
        return (
          <React.Fragment key={question}>
            <div
              id={question}
              className={cx('question-block', section.key, {
                active: activeQuestions.indexOf(question) !== -1,
              })}>
              <div
                className="faq-q"
                onClick={() => {
                  setActiveQuestion(question);
                }}>
                <div className="faq-icon">
                  <ChevronDown />
                </div>
                <Localized id={question}>
                  <h3 />
                </Localized>
              </div>

              <div className="faq-a">
                {answers.length > 1 && (
                  <p>
                    {answers.map((answer: string) => (
                      <Localized key={answer} id={answer}>
                        <li />
                      </Localized>
                    ))}
                  </p>
                )}

                {answers.length === 1 && (
                  <Localized id={answers[0]} {...props}>
                    <p />
                  </Localized>
                )}

                <div className="line" />
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  )
);

export default withLocalization(({ getString }: LocalizationProps) => {
  const activeSection = useActiveSection(Object.values(SECTIONS));
  const [searchString, setSearchString] = useState<string>('');
  const [activeQuestions, setActiveQuestions] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(isMobileResolution());

  React.useEffect(() => {
    if (activeQuestions.length !== 0) {
      setActiveQuestions([]);
    }

    const windowResized = throttle(() => {
      if (isMobile !== isMobileResolution()) {
        setIsMobile(!isMobile);
      }
    }, 200);

    window.addEventListener('resize', windowResized);

    return () => {
      window.removeEventListener('resize', windowResized);
    };
  }, [isMobile]);

  const setActiveQuestion = (question: string) => {
    if (activeQuestions.indexOf(question) === -1) {
      return setActiveQuestions(
        isMobile ? [...activeQuestions, question] : [question]
      );
    }

    setActiveQuestions(activeQuestions.filter((e: string) => e !== question));
  };

  const sections: FaqSection[] = faqSearchSelector({ getString, searchString });

  return (
    <section className="faq-hero">
      <img
        className="wave-top"
        src={require('./images/wave-top.png')}
        alt="Wave"
      />
      <div className="faq-header-container">
        <img
          className="waves"
          src={require('./images/waves.png')}
          alt="Waves"
        />
        <div className="faq-header">
          <div className="text">
            <div className="header-line" />
            <Localized id="faq-title">
              <h1 />
            </Localized>

            <Localized id="faq-description">
              <h2 />
            </Localized>
          </div>
          <div className="intro-img">
            <img
              className="robot"
              src={require('./images/robot.png')}
              alt="Waves"
            />
          </div>
        </div>
      </div>

      <section className="faq-content">
        <div className="faq-container no-padding-xs">
          <form
            className="faq-search"
            onSubmit={(e: React.SyntheticEvent<HTMLElement>) =>
              e.preventDefault()
            }>
            <LocalizedGetAttribute
              id="faq-search-for-answers"
              attribute="label">
              {label => (
                <input
                  type="text"
                  value={searchString}
                  onChange={event => {
                    if (activeQuestions.length !== 0) {
                      setActiveQuestions([]);
                    }

                    setSearchString(event.target.value);
                  }}
                  placeholder={label}
                />
              )}
            </LocalizedGetAttribute>

            <div className="search-button">
              <SearchIconCode className="icon" />
            </div>
          </form>

          <div className="faq-section-container">
            <nav>
              <ul>
                {sections
                  .filter(section => section.content.length !== 0)
                  .map(section => (
                    <li
                      key={section.key}
                      className={cx({ active: section.key == activeSection })}>
                      <div className="line" />

                      <Localized id={section.label} key={section.label}>
                        <a href={'#' + section.key} />
                      </Localized>
                    </li>
                  ))}
              </ul>
            </nav>

            <section className="faq-section">
              {sections.map(section => (
                <Section
                  section={section}
                  key={`section-${section.key}`}
                  activeQuestions={activeQuestions}
                  setActiveQuestion={setActiveQuestion}
                />
              ))}

              {sections.length === 0 && (
                <p>No results were found. Please try a different search.</p>
              )}
            </section>
          </div>
        </div>
      </section>
    </section>
  );
});
