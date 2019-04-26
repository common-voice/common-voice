import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import URLS from '../../urls';
import { Notifications } from '../../stores/notifications';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';

interface NotificationProps {
  addNotification: typeof Notifications.actions.addPill;
}

export const LoginFailure = connect<void, NotificationProps>(
  null,
  {
    addNotification: Notifications.actions.addPill,
  }
)(
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
  user: User.State;
}

type Props = PropsFromState & RouteComponentProps<any>;

export const LoginSuccess = connect<PropsFromState>(({ user }: StateTree) => ({
  user,
}))(
  withRouter(
    class extends React.Component<Props> {
      componentDidMount() {
        this.redirect(this.props);
      }

      componentWillReceiveProps(props: Props) {
        this.redirect(props);
      }

      redirect({ history, user }: Props) {
        const { account, isFetchingAccount } = user;
        if (isFetchingAccount) return;
        const redirectURL = sessionStorage.getItem('redirectURL');
        sessionStorage.removeItem('redirectURL');
        history.replace(
          redirectURL || (account ? URLS.ROOT : URLS.PROFILE_INFO)
        );
      }

      render(): React.ReactNode {
        return null;
      }
    }
  )
);
