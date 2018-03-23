import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import HelpTranslateModal from './help-translate-modal';

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {}

interface State {
  pontoonData: any;
  showHelpTranslateModalFor: {
    code: string;
    name: string;
  };
}

class LanguagesPage extends React.Component<Props, State> {
  state: State = {
    pontoonData: null,
    showHelpTranslateModalFor: null,
  };

  async componentDidMount() {
    this.setState({
      pontoonData: (await this.props.api.fetchPontoonLanguages()).data,
    });
  }

  render() {
    const { pontoonData, showHelpTranslateModalFor } = this.state;
    const { project } = (pontoonData || {}) as any;

    if (!project) {
      return <div />;
    }

    return (
      <React.Fragment>
        {showHelpTranslateModalFor && (
          <HelpTranslateModal
            locale={this.state.showHelpTranslateModalFor}
            onRequestClose={() =>
              this.setState({ showHelpTranslateModalFor: null })
            }
          />
        )}
        {project.localizations.map(
          ({ approvedStrings, totalStrings, locale }: any) => (
            <div key={locale.code} style={{ marginBottom: '1rem' }}>
              <h2>{locale.name}</h2>
              {approvedStrings}/{totalStrings}
              <button
                onClick={() =>
                  this.setState({ showHelpTranslateModalFor: locale })
                }>
                Help Translate!
              </button>
            </div>
          )
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(LanguagesPage);
