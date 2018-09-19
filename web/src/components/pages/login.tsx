import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import URLS from '../../urls';
import API from '../../services/api';
import { Notifications } from '../../stores/notifications';
import StateTree from '../../stores/tree';

interface NotificationProps {
  addNotification: typeof Notifications.actions.add;
}

export const LoginFailure = connect<void, NotificationProps>(null, {
  addNotification: Notifications.actions.add,
})(
  withRouter(
    class extends React.Component<
      NotificationProps & RouteComponentProps<any>
    > {
      componentDidMount() {
        const { addNotification, history } = this.props;
        addNotification('Login failed!');
        history.replace(URLS.ROOT);
      }

      render(): React.ReactNode {
        return null;
      }
    }
  )
);

interface PropsFromState {
  api: API;
}

export const LoginSuccess = connect<PropsFromState, void>(
  ({ api }: StateTree) => ({ api })
)(
  withRouter(
    class extends React.Component<PropsFromState & RouteComponentProps<any>> {
      async componentDidMount() {
        const { api, history } = this.props;
        const userClients = await api.fetchUserClients();
        const hasAccount = userClients.find(u => u.sso_id);
        history.replace(hasAccount ? URLS.ROOT : URLS.PROFILE_INFO);
      }

      render(): React.ReactNode {
        return null;
      }
    }
  )
);
