import * as React from 'react';
import { useState } from 'react';
import * as cx from 'classnames';
import { LocalizedGetAttribute } from '../../locale-helpers';
import { SearchIconCode, ChevronDown } from '../../ui/icons';
import useActiveSection from '../../../hooks/use-active-section';
import { faqSearchSelector, FaqSection, SECTIONS } from './selectors';
import {
  Localized,
  LocalizationProps,
  withLocalization,
} from 'fluent-react/compat';

import './faq.css';

type SectionProps = {
  section: FaqSection;
  activeQuestion: string;
  setActiveQuestion: (question: string) => void;
};

const Section: React.ComponentType<SectionProps> = React.memo(
  ({ section, activeQuestion, setActiveQuestion }: SectionProps) => (
    <div id={section.key} className="faq-q-and-a">
      {section.content.map(([question, answers, props]) => {
        return (
          <React.Fragment key={question}>
            <div
              id={question}
              className={cx('question-block', section.key, {
                active: question == activeQuestion,
              })}>
              <div
                className="faq-q"
                onClick={() => {
                  setActiveQuestion(
                    question === activeQuestion ? null : question
                  );
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
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

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
                    if (activeQuestion !== null) {
                      setActiveQuestion(null);
                    }

                    setSearchString(event.target.value);
                  }}
                  placeholder={label}
                  required
                />
              )}
            </LocalizedGetAttribute>

            <button type="submit" className="search-button">
              <SearchIconCode className="icon" />
            </button>
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
                  activeQuestion={activeQuestion}
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
