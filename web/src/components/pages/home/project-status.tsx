import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
const { Localized } = require('fluent-react');
import { trackNavigation } from '../../../services/tracker';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';

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
          <Localized id="status-contribute">
            <Link
              to="/record"
              onClick={() => trackNavigation('progress-to-record')}
            />
          </Localized>
        </div>

        <div className="contents">
          <div className="language-progress">
            <b>ENGLISH</b>
            <div className="progress-bar">
              <div
                className="validated-hours"
                style={
                  validatedHours
                    ? { width: 100 * validatedHours / goal + '%' }
                    : { width: 0, padding: 0 }
                }>
                {validatedHours}
              </div>
            </div>
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

          <div onClick={this.props.onRequestLanguage}>
            <Localized id="status-more-soon">
              <span />
            </Localized>
            <div className="progress-bar" />
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
