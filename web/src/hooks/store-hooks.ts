import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useTypedSelector } from '../stores/tree';
import {
  Newsletter,
  Subscriptions,
  newsletters,
  emptySubscriptions,
} from 'common';

export function useAction<T>(action: (...args: T[]) => any) {
  const dispatch = useDispatch();
  return useCallback((...args: T[]) => dispatch(action(...args)), [dispatch]);
}

export function useAccount() {
  return useTypedSelector(({ user }) => user.account);
}

export function useAPI() {
  return useTypedSelector(({ api }) => api);
}

export function useNotifications() {
  return useTypedSelector(({ notifications }) => notifications);
}

export function useSubscriptions(): [
  boolean, // Loading state.
  Subscriptions,
  React.Dispatch<React.SetStateAction<Subscriptions>>
] {
  const account = useAccount();
  const [subscriptions, setSubscriptions] = useState<Subscriptions | null>(
    null
  );

  useEffect(() => {
    if (!account.basket_token) {
      setSubscriptions(emptySubscriptions);
      return;
    }
    fetch(
      `https://basket.mozilla.org/news/lookup-user/?token=${account.basket_token}`
    )
      .then(response => response.json())
      .then(body =>
        setSubscriptions(
          body.newsletters
            .filter((name: any) => newsletters.includes(name))
            .reduce(
              (acc: Subscriptions, newsletter: Newsletter) => ({
                ...acc,
                [newsletter]: true,
              }),
              emptySubscriptions
            )
        )
      );
  }, [account.basket_token]);

  return [
    subscriptions === null,
    subscriptions || emptySubscriptions,
    setSubscriptions,
  ];
}
