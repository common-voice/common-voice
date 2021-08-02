import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { CheckWithBoxIcon, AlertIcon, ChevronDown } from '../../ui/icons';

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
  }[];
};

const createExamples = (
  type: 'error' | 'correct',
  num: number,
  skipExplanation?: boolean,
  elems?: any
) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push({ type, elems });
  }
  return arr;
};
const criteriaList: Criteria[] = [
  {
    title: 'misreadings',
    descriptionExtended: {
      type: 'list',
      numElems: 5,
      elems: {
        strong: <strong />,
      },
    },
    examples: [
      ...createExamples('correct', 1, true),
      ...createExamples('error', 6),
    ],
  },
  {
    title: 'varying-pronunciations',
    descriptionExtended: {
      type: 'text',
    },
    examples: [...createExamples('correct', 1), ...createExamples('error', 1)],
  },
  {
    title: 'background-noise',
    descriptionExtended: {
      type: 'text',
    },
    examples: [
      ...createExamples('correct', 1, true, {
        strong: <span className="emphasis" />,
      }),
      ...createExamples('error', 2, false, {
        strong: <span className="emphasis" />,
      }),
    ],
  },
  {
    title: 'background-voices',
    examples: [
      ...createExamples('error', 1, false, {
        strong: <span className="emphasis" />,
      }),
    ],
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
    <div className="contribution-criteria">
      <div className="contribution-criteria-content">
        <Localized id="contribution-criteria-page-title">
          <h1 className="contribution-criteria-page-title" />
        </Localized>
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
                  elems={{ br: <br /> }}>
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
                  {criterion.examples.map((example, i) => (
                    <div key={i + 1} className="criterion-example">
                      {example.type == 'error' ? (
                        <AlertIcon />
                      ) : (
                        <CheckWithBoxIcon />
                      )}
                      <Localized
                        id={`contribution-${criterion.title}-example-${
                          i + 1
                        }-title`}
                        elems={example.elems}>
                        <p className="example-headline" />
                      </Localized>
                      {!example.skipExplanation && (
                        <Localized
                          id={`contribution-${criterion.title}-example-${
                            i + 1
                          }-explanation`}>
                          <p />
                        </Localized>
                      )}
                    </div>
                  ))}
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
    </div>
  );
}
