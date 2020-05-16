import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useTypedSelector } from '../stores/tree';

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

export function useIsSubscribed() {
  const account = useAccount();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(null);

  useEffect(() => {
    if (!account.basket_token) {
      setIsSubscribed(false);
      return;
    }
    fetch(
      'https://basket.mozilla.org/news/lookup-user/?token=' +
        account.basket_token
    )
      .then(response => response.json())
      .then(body => setIsSubscribed(body.newsletters.includes('common-voice')));
  }, [account.basket_token]);

  return isSubscribed;
}

export function useStickyState(defaultValue: any, key: string) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);

    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
