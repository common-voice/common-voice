import * as React from 'react';
import { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useAction } from '../../hooks/store-hooks';
import URLS from '../../urls';
import { Notifications } from '../../stores/notifications';
import { useTypedSelector } from '../../stores/tree';
import { trackProfile } from '../../services/tracker';
import { useLocale } from '../locale-helpers';

export const LoginFailure = withRouter(
  ({ history }: RouteComponentProps<any, any, any>) => {
    const [, toLocaleRoute] = useLocale();
    const addNotification = useAction(Notifications.actions.addPill);

    useEffect(() => {
      addNotification('Login failed!');
      history.replace(toLocaleRoute(URLS.ROOT));
    }, []);

    return null;
  }
);

export const LoginSuccess = withRouter(
  ({ history, location }: RouteComponentProps<any, any, any>) => {
    const user = useTypedSelector(({ user }) => user);
    const [locale, toLocaleRoute] = useLocale();

    useEffect(() => {
      const { account, isFetchingAccount } = user;
      if (isFetchingAccount) return;
      const redirectURL = sessionStorage.getItem('redirectURL');
      sessionStorage.removeItem('redirectURL');
      console.log(account, URLS.PROFILE_INFO,  location.search, redirectURL);
      if (account) {
        trackProfile('login', locale);
      }

      history.replace(
        account
          ? redirectURL || toLocaleRoute(URLS.DASHBOARD + location.search)
          : URLS.PROFILE_INFO + location.search
      );
    }, [user]);

    return null;
  }
);
