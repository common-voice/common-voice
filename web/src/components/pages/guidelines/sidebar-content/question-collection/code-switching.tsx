import * as React from 'react'
import classNames from 'classnames'
import { Localized } from '@fluent/react'

import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'
import { SidebarContentProps } from '../../types'

export const CodeSwitching = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}: SidebarContentProps) => (
  <>
    <div className="sidebar-content code-switching" id={id}>
      <div className="line" />
      <Localized id="code-switching" key="code-switching">
        <h1 className="guidelines-content-heading" id="code-switching" />
      </Localized>
    </div>
    <div className="sidebar-content code-switching">
      <div className="line" />
      <div className="sidebar-content-header">
        <Localized
          id="adding-a-question"
          key="code-switching-adding-a-question">
          <TextButton
            onClick={toggleVisibleSection}
            className="guidelines-content-heading"
          />
        </Localized>
        <ChevronDown
          onClick={toggleVisibleSection}
          className={classNames('chevron', { 'rotate-180': contentVisible })}
        />
      </div>
      {(contentVisible || !isMobileWidth) && (
        <div className="content-wrapper">
          <span className="line" />
          <Localized
            id="code-switching-adding-question-subheader"
            key="code-switching-adding-question-subheader">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-adding-question-subheader"
            />
          </Localized>
          <ul>
            <Localized
              id="code-switching-adding-question-criteria-1"
              key="code-switching-adding-question-criteria-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-adding-question-criteria-2"
              key="code-switching-adding-question-criteria-2">
              <li />
            </Localized>
            <Localized
              id="code-switching-adding-question-criteria-3"
              key="code-switching-adding-question-criteria-3">
              <li />
            </Localized>
          </ul>
          <Localized
            id="code-switching-adding-question-note"
            key="code-switching-adding-question-note">
            <p className="guidelines-content-explanation" />
          </Localized>

          <Localized
            id="code-switching-types-subheader"
            key="code-switching-types-subheader">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-types-subheader"
            />
          </Localized>

          <Localized
            id="code-switching-use-bilingual-prompts-header"
            key="code-switching-use-bilingual-prompts-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-use-bilingual-prompts-explanation"
            key="code-switching-use-bilingual-prompts-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <div className="example-container">
            <div className="example-tips-container">
              <Localized
                id="code-switching-use-bilingual-prompts-explanation-example"
                key="code-switching-use-bilingual-prompts-explanation-example">
                <p className="tip-text" />
              </Localized>
            </div>
          </div>

          <Localized
            id="code-switching-ask-bilingual-contexts-header"
            key="code-switching-ask-bilingual-contexts-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-ask-bilingual-contexts-explanation"
            key="code-switching-ask-bilingual-contexts-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <div className="example-container">
            <div className="example-tips-container">
              <Localized
                id="code-switching-ask-bilingual-contexts-explanation-example"
                key="code-switching-ask-bilingual-contexts-explanation-example">
                <p className="tip-text" />
              </Localized>
            </div>
          </div>

          <Localized
            id="code-switching-focus-emotional-header"
            key="code-switching-focus-emotional-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-focus-emotional-explanation"
            key="code-switching-focus-emotional-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <div className="example-container">
            <div className="example-tips-container">
              <Localized
                id="code-switching-focus-emotional-explanation-example"
                key="code-switching-focus-emotional-explanation-example">
                <p className="tip-text" />
              </Localized>
            </div>
          </div>

          <Localized
            id="code-switching-direct-quotes-header"
            key="code-switching-direct-quotes-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-direct-quotes-explanation"
            key="code-switching-direct-quotes-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <div className="example-container">
            <div className="example-tips-container">
              <Localized
                id="code-switching-direct-quotes-explanation-example"
                key="code-switching-direct-quotes-explanation-example">
                <p className="tip-text" />
              </Localized>
            </div>
          </div>

          <Localized
            id="code-switching-cultural-topics-header"
            key="code-switching-cultural-topics-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-cultural-topics-explanation"
            key="code-switching-cultural-topics-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <div className="example-container">
            <div className="example-tips-container">
              <Localized
                id="code-switching-cultural-topics-explanation-example"
                key="code-switching-cultural-topics-explanation-example">
                <p className="tip-text" />
              </Localized>
            </div>
          </div>

          <Localized
            id="code-switching-informal-scenarios-header"
            key="code-switching-informal-scenarios-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-informal-scenarios-explanation"
            key="code-switching-informal-scenarios-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <div className="example-container">
            <div className="example-tips-container">
              <Localized
                id="code-switching-informal-scenarios-explanation-example"
                key="code-switching-informal-scenarios-explanation-example">
                <p className="tip-text" />
              </Localized>
            </div>
          </div>

          <Localized
            id="code-switching-avoid-subheader"
            key="code-switching-avoid-subheader">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-avoid-subheader"
            />
          </Localized>
          <Localized
            id="code-switching-avoid-intro"
            key="code-switching-avoid-intro">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized id="code-switching-avoid-1" key="code-switching-avoid-1">
              <li />
            </Localized>
            <Localized id="code-switching-avoid-2" key="code-switching-avoid-2">
              <li />
            </Localized>
            <Localized id="code-switching-avoid-3" key="code-switching-avoid-3">
              <li />
            </Localized>
          </ul>
          <Localized
            id="code-switching-dont-header"
            key="code-switching-dont-header">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized id="code-switching-dont-1" key="code-switching-dont-1">
              <li className="guidelines-content-explanation" />
            </Localized>
          </ul>

          <Localized
            id="code-switching-review-subheader"
            key="code-switching-review-subheader">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-review-subheader"
            />
          </Localized>
          <Localized
            id="code-switching-review-intro"
            key="code-switching-review-intro">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-review-criterion-1"
              key="code-switching-review-criterion-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-review-criterion-2"
              key="code-switching-review-criterion-2">
              <li />
            </Localized>
            <Localized
              id="code-switching-review-criterion-3"
              key="code-switching-review-criterion-3">
              <li />
            </Localized>
          </ul>
          <Localized
            id="code-switching-review-does-not-header"
            key="code-switching-review-does-not-header"
            elems={{ bold: <strong /> }}>
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized
            id="code-switching-review-offensive-content"
            key="code-switching-review-offensive-content"
            elems={{ bold: <strong /> }}>
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-review-no-1"
              key="code-switching-review-no-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-review-no-2"
              key="code-switching-review-no-2">
              <li />
            </Localized>
            <Localized
              id="code-switching-review-no-3"
              key="code-switching-review-no-3">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-answer-subheader"
            key="code-switching-answer-subheader">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-answer-subheader"
            />
          </Localized>
          <Localized
            id="code-switching-answer-intro"
            key="code-switching-answer-intro">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-answer-bullet-1"
              key="code-switching-answer-bullet-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-answer-bullet-2"
              key="code-switching-answer-bullet-2">
              <li />
            </Localized>
            <Localized
              id="code-switching-answer-bullet-3"
              key="code-switching-answer-bullet-3">
              <li />
            </Localized>
            <Localized
              id="code-switching-answer-bullet-4"
              key="code-switching-answer-bullet-4">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-authentic-header"
            key="code-switching-authentic-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <ul>
            <li>
              <Localized
                id="code-switching-authentic-speak"
                key="code-switching-authentic-speak"
                elems={{ bold: <strong /> }}>
                <p className="guidelines-content-explanation" />
              </Localized>

              <div className="example-container">
                <div className="example-tips-container">
                  <Localized
                    id="code-switching-authentic-speak-example"
                    key="code-switching-authentic-speak-example"
                    elems={{ bold: <strong /> }}>
                    <p className="tip-text" />
                  </Localized>
                </div>
              </div>
            </li>

            <li>
              <Localized
                id="code-switching-use-both-languages"
                key="code-switching-use-both-languages"
                elems={{ bold: <strong /> }}>
                <p className="guidelines-content-explanation" />
              </Localized>

              <div className="example-container">
                <div className="example-tips-container">
                  <Localized
                    id="code-switching-use-both-languages-example"
                    key="code-switching-use-both-languages-example">
                    <p className="tip-text" />
                  </Localized>
                </div>
              </div>
            </li>

            <li>
              <Localized
                id="code-switching-authentic-direct-quotes"
                key="code-switching-authentic-direct-quotes"
                elems={{ bold: <strong /> }}>
                <p className="guidelines-content-explanation" />
              </Localized>
              <div className="example-container">
                <div className="example-tips-container">
                  <Localized
                    id="code-switching-authentic-direct-quotes-example"
                    key="code-switching-authentic-direct-quotes-example">
                    <p className="tip-text" />
                  </Localized>
                </div>
              </div>
            </li>

            <li>
              <Localized
                id="code-switching-authentic-reflect"
                key="code-switching-authentic-reflect"
                elems={{ bold: <strong /> }}>
                <p className="guidelines-content-explanation" />
              </Localized>
            </li>

            <li>
              <Localized
                id="code-switching-authentic-full-context"
                key="code-switching-authentic-full-context"
                elems={{ bold: <strong /> }}>
                <p className="guidelines-content-explanation" />
              </Localized>
            </li>
          </ul>

          <Localized
            id="code-switching-answer-dont-subheader"
            key="code-switching-answer-dont-subheader">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-answer-dont-subheader"
            />
          </Localized>

          <Localized id="dont-subheader" key="cs-dont-subheader-1">
            <p className="guidelines-content-explanation header" />
          </Localized>

          <ul>
            <Localized
              id="code-switching-answer-dont-correct-language"
              key="code-switching-answer-dont-correct-language"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-answer-dont-avoid-switching"
              key="code-switching-answer-dont-avoid-switching"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-answer-dont-formal-writing"
              key="code-switching-answer-dont-formal-writing"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-answer-dont-force-switch"
              key="code-switching-answer-dont-force-switch"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-answer-dont-translate-repeat"
              key="code-switching-answer-dont-translate-repeat"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-transcribe-subheader"
            key="code-switching-transcribe-subheader">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-transcribe-subheader"
            />
          </Localized>
          <Localized
            id="code-switching-transcribe-intro"
            key="code-switching-transcribe-intro">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-transcribe-do-1"
              key="code-switching-transcribe-do-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-transcribe-do-2"
              key="code-switching-transcribe-do-2">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-capture-header"
            key="code-switching-capture-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-capture-explanation"
            key="code-switching-capture-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <Localized
            id="code-switching-filler-header"
            key="code-switching-filler-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-filler-explanation"
            key="code-switching-filler-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          {/* Use standard spelling for each language */}
          <Localized
            id="code-switching-spelling-header"
            key="code-switching-spelling-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-spelling-explanation"
            key="code-switching-spelling-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <Localized
            id="code-switching-cleanup-header"
            key="code-switching-cleanup-header">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-cleanup-header"
            />
          </Localized>
          <Localized id="dont-subheader" key="cs-dont-subheader-2">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-cleanup-1"
              key="code-switching-cleanup-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-cleanup-2"
              key="code-switching-cleanup-2">
              <li />
            </Localized>
            <Localized
              id="code-switching-cleanup-3"
              key="code-switching-cleanup-3">
              <li />
            </Localized>
            <Localized
              id="code-switching-cleanup-4"
              key="code-switching-cleanup-4">
              <li />
            </Localized>
            <Localized
              id="code-switching-cleanup-5"
              key="code-switching-cleanup-5">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-tagging-subheader"
            key="code-switching-tagging-subheader">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-tagging-subheader"
            />
          </Localized>
          <Localized
            id="code-switching-tagging-error-intro"
            key="code-switching-tagging-error-intro">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-tagging-error-1"
              key="code-switching-tagging-error-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-tagging-error-2"
              key="code-switching-tagging-error-2">
              <li />
            </Localized>
            <Localized
              id="code-switching-tagging-error-3"
              key="code-switching-tagging-error-3">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-orthography-header"
            key="code-switching-orthography-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-orthography-explanation"
            key="code-switching-orthography-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-orthography-explanation-example-1"
              key="code-switching-orthography-explanation-example-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-orthography-explanation-example-2"
              key="code-switching-orthography-explanation-example-2">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-pronunciation-header"
            key="code-switching-pronunciation-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-pronunciation-explanation"
            key="code-switching-pronunciation-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <ul>
            <Localized
              id="code-switching-pronunciation-explanation-example-1"
              key="code-switching-pronunciation-explanation-example-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-pronunciation-explanation-example-2"
              key="code-switching-pronunciation-explanation-example-2">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-single-token-header"
            key="code-switching-single-token-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-single-token-explanation"
            key="code-switching-single-token-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <Localized
            id="code-switching-punctuation-tagging-header"
            key="code-switching-punctuation-tagging-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-punctuation-tagging-explanation"
            key="code-switching-punctuation-tagging-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <ul>
            <Localized
              id="code-switching-punctuation-tagging-explanation-example-1"
              key="code-switching-punctuation-tagging-explanation-example-1"
              elems={{
                purple: <span className="purple" />,
                blue: <span className="blue" />,
              }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-punctuation-tagging-explanation-example-2"
              key="code-switching-punctuation-tagging-explanation-example-2"
              elems={{
                purple: <span className="purple" />,
                blue: <span className="blue" />,
              }}>
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-lookalikes-header"
            key="code-switching-lookalikes-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-lookalikes-explanation"
            key="code-switching-lookalikes-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <ul>
            <Localized
              id="code-switching-lookalikes-explanation-example-1"
              key="code-switching-lookalikes-explanation-example-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-lookalikes-explanation-example-2"
              key="code-switching-lookalikes-explanation-example-2">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-not-tag-header"
            key="code-switching-not-tag-header">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized
            id="code-switching-not-tag-explanation"
            key="code-switching-not-tag-explanation"
            elems={{ bold: <strong /> }}>
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized
            id="code-switching-not-tag-proper-names"
            key="code-switching-not-tag-proper-names"
            elems={{ bold: <strong /> }}>
            <p className="guidelines-content-explanation" />
          </Localized>

          <ul>
            <Localized
              id="code-switching-not-tag-proper-names-example-1"
              key="code-switching-not-tag-proper-names-example-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-not-tag-proper-names-example-2"
              key="code-switching-not-tag-proper-names-example-2">
              <li />
            </Localized>
            <Localized
              id="code-switching-not-tag-proper-names-example-3"
              key="code-switching-not-tag-proper-names-example-3">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-not-tag-mixed-words"
            key="code-switching-not-tag-mixed-words"
            elems={{ bold: <strong /> }}>
            <p className="guidelines-content-explanation" />
          </Localized>

          <ul>
            <Localized
              id="code-switching-not-tag-mixed-words-example"
              key="code-switching-not-tag-mixed-words-example">
              <li />
            </Localized>
          </ul>

          <Localized
            id="code-switching-not-tag-interjections"
            key="code-switching-not-tag-interjections"
            elems={{ bold: <strong /> }}>
            <p className="guidelines-content-explanation" />
          </Localized>

          <ul>
            <Localized
              id="code-switching-not-tag-interjections-example-1"
              key="code-switching-not-tag-interjections-example-1">
              <li />
            </Localized>
            <Localized
              id="code-switching-not-tag-interjections-example-2"
              key="code-switching-not-tag-interjections-example-2">
              <li />
            </Localized>
            <Localized
              id="code-switching-not-tag-interjections-example-3"
              key="code-switching-not-tag-interjections-example-3">
              <li />
            </Localized>
            <Localized
              id="code-switching-not-tag-interjections-example-4"
              key="code-switching-not-tag-interjections-example-4">
              <li />
            </Localized>
          </ul>
        </div>
      )}
    </div>
  </>
)
