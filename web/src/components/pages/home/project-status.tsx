import * as React from 'react';
import { connect } from 'react-redux';
import { Localized } from 'fluent-react';
import { trackNavigation } from '../../../services/tracker';
import URLS from '../../../urls';
import ProgressBar from '../../progress-bar/progress-bar';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { ContributableLocaleLock, LocaleLink } from '../../locale-helpers';
import { Button, Hr } from '../../ui/ui';

const GOAL_HOURS = 500;

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {
  onRequestLanguage: () => any;
}

interface State {
  validatedHours?: number;
}

class ProjectStatus extends React.Component<Props, State> {
  state: State = {
    validatedHours: null,
  };

  async componentDidMount() {
    this.setState({
      validatedHours: await this.props.api.fetchValidatedHours(),
    });
  }

  render() {
    const { validatedHours } = this.state;
    const goal = Math.ceil((1 + validatedHours) / GOAL_HOURS) * GOAL_HOURS;

    return (
      <div className="project-status">
        <div className="title-and-action">
          <Localized id="status-title">
            <h4 />
          </Localized>

          <ContributableLocaleLock>
            <Localized id="status-contribute">
              <LocaleLink
                to={URLS.SPEAK}
                onClick={() => trackNavigation('progress-to-record')}
              />
            </Localized>
          </ContributableLocaleLock>
        </div>

        <div className="contents">
          <div className="language-progress">
            <Localized id="en">
              <b />
            </Localized>
            <ProgressBar progress={validatedHours ? validatedHours / goal : 0}>
              {validatedHours}
            </ProgressBar>
            <div className="numbers">
              {validatedHours === null ? (
                <Localized id="status-loading">
                  <div />
                </Localized>
              ) : (
                <React.Fragment>
                  <Localized id="status-hours" $hours={validatedHours}>
                    <div />
                  </Localized>
                  <Localized id="status-goal" $goal={goal}>
                    <div />
                  </Localized>
                </React.Fragment>
              )}
            </div>
          </div>

          <div className="request-language">
            <Hr style={{ marginBottom: '2rem' }} />

            <Localized id="request-language-text">
              <div />
            </Localized>

            <Localized id="request-language-button">
              <Button rounded onClick={this.props.onRequestLanguage} />
            </Localized>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(ProjectStatus);
