import * as React from 'react';
const { Fragment } = require('react');
import { Link } from 'react-router-dom';
import { trackNavigation } from '../../../services/tracker';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { connect } from 'react-redux';

const GOAL_HOURS = 500;

interface PropsFromState {
  api: API;
}

interface State {
  validatedHours?: number;
}

class ProjectStatus extends React.Component<PropsFromState, State> {
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
    const goal = Math.ceil(validatedHours / GOAL_HOURS) * GOAL_HOURS;

    return (
      <div className="project-status">
        <div className="title-and-action">
          <h4>Overall project status: see how far we've come!</h4>
          <Link
            to="/record"
            onClick={() => trackNavigation('progress-to-record')}>
            Contribute Your Voice
          </Link>
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
              {validatedHours ? (
                <Fragment>
                  <div>{validatedHours} validated hours so far!</div>
                  <div>Next Goal: {goal}</div>
                </Fragment>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>

          <div>
            More languages coming soon!
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
