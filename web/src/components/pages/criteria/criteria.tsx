import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';

import { CheckWithBoxIcon, AlertIcon, ChevronDown } from '../../ui/icons';
import Page from '../../ui/page';
import PageHeading from '../../ui/page-heading';

import './criteria.css';

const EXAMPLE_LIMIT = 3;

type ExtendedDesc = {
  type: 'list' | 'text';
  numElems?: number;
  elems?: any;
};

type Criteria = {
  title: string;
  descriptionExtended?: ExtendedDesc;
  examples?: {
    type: 'error' | 'correct';
    skipExplanation?: boolean;
    elems?: any;
    titleLabel?: string;
    explanationLabel?: string;
  }[];
};

const elemStrong = { strong: <strong /> };
const elemEmphasis = { strong: <span className="emphasis" /> };
const elemBr = { br: <br /> };

const criteriaList: Criteria[] = [
  {
    title: 'misreadings',
    descriptionExtended: {
      type: 'list',
      numElems: 5,
      elems: elemStrong,
    },
    examples: [
      { type: 'correct', skipExplanation: true },
      { type: 'error' },
      { type: 'error' },
      { type: 'error' },
      { type: 'correct', skipExplanation: true },
      { type: 'error' },
      { type: 'error' },
      { type: 'error' },
    ],
  },
  {
    title: 'varying-pronunciations',
    descriptionExtended: {
      type: 'text',
    },
    examples: [{ type: 'correct' }, { type: 'error' }],
  },
  {
    title: 'background-noise',
    descriptionExtended: {
      type: 'text',
    },
    examples: [
      {
        type: 'error',
        titleLabel: '1-fixed',
        explanationLabel: '1-fixed',
        skipExplanation: true,
        elems: elemEmphasis,
      },
      {
        type: 'error',
        titleLabel: '2-fixed',
        explanationLabel: '2',
        elems: elemEmphasis,
      },
      {
        type: 'error',
        titleLabel: '3-fixed',
        explanationLabel: '2',
        elems: elemEmphasis,
      },
    ],
  },
  {
    title: 'background-voices',
    examples: [{ type: 'error', elems: elemEmphasis }],
  },
  { title: 'volume' },
  { title: 'reader-effects' },
  { title: 'just-unsure' },
];

export default function Criteria() {
  const [showMoreArray, setShowMoreArray] = useState(
    criteriaList.map(_ => false)
  );

  const toggleShowMore = (i: number) => {
    const newArray = [...showMoreArray];
    newArray[i] = !newArray[i];
    setShowMoreArray(newArray);
  };

  const descriptionList = (title: string, list: ExtendedDesc) => {
    const listHtml = [];
    for (let i = 1; i <= list.numElems; i++) {
      listHtml.push(
        <Localized
          key={i}
          id={`contribution-${title}-description-extended-list-${i}`}
          elems={list.elems}>
          <li />
        </Localized>
      );
    }
    return <ul>{listHtml}</ul>;
  };

  return (
    <Page className="contribution-criteria">
      <div className="contribution-criteria-content">
        <PageHeading>
          <Localized id="contribution-criteria-page-title" />
        </PageHeading>

        <Localized id="contribution-criteria-page-description">
          <div className="contribution-criteria-page-description" />
        </Localized>

        {criteriaList.map((criterion, i) => {
          return (
            <div className={`criterion`} key={criterion.title}>
              <div className="criterion-index">{i + 1}</div>
              <Localized id={`contribution-${criterion.title}-title`}>
                <h2 />
              </Localized>
              <div className="criterion-explanation">
                <Localized
                  id={`contribution-${criterion.title}-description`}
                  elems={elemBr}>
                  <p />
                </Localized>
                {criterion.descriptionExtended &&
                  (criterion.descriptionExtended.type == 'list' ? (
                    descriptionList(
                      criterion.title,
                      criterion.descriptionExtended
                    )
                  ) : (
                    <Localized
                      id={`contribution-${criterion.title}-description-extended`}
                    />
                  ))}
              </div>
              {criterion.examples && (
                <div
                  className={`criterion-examples ${
                    criterion.examples.length > EXAMPLE_LIMIT
                      ? 'has-show-more'
                      : ''
                  } ${showMoreArray[i] ? 'expanded' : ''}`}>
                  <Localized id="contribution-for-example">
                    <span />
                  </Localized>
                  {criterion.examples.map((example, i) => {
                    const title = example.titleLabel
                      ? example.titleLabel
                      : i + 1;
                    const explanation = example.explanationLabel
                      ? example.explanationLabel
                      : title;

                    return (
                      <div key={i + 1} className="criterion-example">
                        {example.type == 'error' ? (
                          <AlertIcon />
                        ) : (
                          <CheckWithBoxIcon />
                        )}
                        <Localized
                          id={`contribution-${criterion.title}-example-${title}-title`}
                          elems={example.elems}>
                          <p className="example-headline" />
                        </Localized>
                        {!example.skipExplanation && (
                          <Localized
                            id={`contribution-${criterion.title}-example-${explanation}-explanation`}>
                            <p />
                          </Localized>
                        )}
                      </div>
                    );
                  })}
                  {criterion.examples.length > EXAMPLE_LIMIT ? (
                    <div
                      className="show-more-button"
                      onClick={() => toggleShowMore(i)}>
                      <Localized
                        id={`see-${showMoreArray[i] ? 'less' : 'more'}`}
                        elems={{
                          chevron: showMoreArray[i] ? (
                            <ChevronDown className="rotate-180" />
                          ) : (
                            <ChevronDown />
                          ),
                        }}>
                        <span />
                      </Localized>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Page>
  );
}
