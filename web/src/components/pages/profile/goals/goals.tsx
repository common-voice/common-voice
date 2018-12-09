import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { AllGoals, Goal } from 'common/goals';
import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { ALL_LOCALES } from '../../../language-select/language-select';
import LanguagesBar from '../../../languages-bar/languages-bar';

import './goals.css';

interface PropsFromState {
  api: API;
}

interface State {
  allGoals: AllGoals;
  locale: string;
}

const Wave = () => (
  <svg width="160" height="70" viewBox="0 0 160 70">
    <defs>
      <linearGradient id="wave-b" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" stopColor="#FF4F5E" stopOpacity="0" />
        <stop offset="100%" stopColor="rgba(0,0,0,.4)" />
      </linearGradient>
      <path
        id="wave-a"
        d="M0 45.229c21.074-18.809 28.61-2.594 54.87-2.594C83.025 42.635 86.378 21 111.59 21c27.04 0 29.061 20.902 48.41 24.229V91H0V45.229z"
      />
    </defs>
    <use
      fill="url(#wave-b)"
      fillRule="evenodd"
      opacity=".5"
      style={{ mixBlendMode: 'multiply' }}
      transform="matrix(-1 0 0 1 160 -21)"
      xlinkHref="#wave-a"
    />
  </svg>
);

const GoalBox = ({
  date,
  goal,
  isNext,
  type,
}: Goal & { isNext: boolean; type: string }) => (
  <div className={'goal-box ' + type + (date ? ' done' : '')}>
    {(date || isNext) && <Wave />}
    <div className="goal">{goal}</div>
    <hr />
    <Localized
      id={
        ({
          streaks: 'days',
          clips: 'recordings',
          votes: 'validations',
        } as any)[type]
      }
      $count={goal}>
      <div className="unit" />
    </Localized>
    {date && (
      <div className="date">
        {new Date(date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </div>
    )}
  </div>
);

class GoalsPage extends React.Component<PropsFromState, State> {
  state: State = { allGoals: null, locale: ALL_LOCALES };

  async componentDidMount() {
    await this.fetchGoals(this.state.locale);
  }

  handleLocaleChange = async (locale: string) => {
    this.setState({ locale });
    await this.fetchGoals(locale);
  };

  fetchGoals = async (locale: string) => {
    this.setState({
      allGoals: await this.props.api.fetchGoals(
        locale == ALL_LOCALES ? null : locale
      ),
    });
  };

  render() {
    const { allGoals, locale } = this.state;
    return (
      <div className="goals">
        <LanguagesBar
          locale={locale}
          onLocaleChange={this.handleLocaleChange}
        />
        {allGoals &&
          Object.entries(allGoals).map(
            ([type, [current, goals]]: [string, [number, Goal[]]]) => (
              <React.Fragment>
                <Localized
                  id={
                    ({ clips: 'speak', votes: 'listen' } as any)[type] || type
                  }>
                  <h2 />
                </Localized>
                <div className="goal-boxes">
                  {goals.map((goal, i) => (
                    <GoalBox
                      {...goal}
                      type={type}
                      isNext={(goals[i - 1] || ({} as any)).date}
                    />
                  ))}
                </div>
              </React.Fragment>
            )
          )}
      </div>
    );
  }
}

export default connect<PropsFromState>(({ api }: StateTree) => ({ api }))(
  GoalsPage
);
