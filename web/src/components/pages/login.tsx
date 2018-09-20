import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { UserClients } from '../../../../common/user_clients';
import URLS from '../../urls';
import { Notifications } from '../../stores/notifications';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';

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
  userClients: UserClients;
}

interface PropsFromDispatch {
  refreshUserClients: typeof User.actions.refreshUserClients;
}

type Props = PropsFromState & PropsFromDispatch & RouteComponentProps<any>;

export const LoginSuccess = connect<PropsFromState, PropsFromDispatch>(
  ({ user }: StateTree) => ({ userClients: user.userClients }),
  { refreshUserClients: User.actions.refreshUserClients }
)(
  withRouter(
    class extends React.Component<Props> {
      componentDidMount() {
        this.props.refreshUserClients();
      }

      componentDidUpdate({ history, userClients }: Props) {
        const hasAccount = Boolean(userClients.find((u: any) => u.sso && u.id));
        history.replace(hasAccount ? URLS.ROOT : URLS.PROFILE_INFO);
      }

      render(): React.ReactNode {
        return null;
      }
    }
  )
);
