import { useDispatch } from 'react-redux';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTypedSelector } from '../stores/tree';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      .then(body =>
        setIsSubscribed(body.newsletters?.includes('common-voice'))
      );
  }, [account.basket_token]);

  return isSubscribed;
}

export function useLocalStorageState<T>(
  defaultValue: T,
  key?: string
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    if (!key) {
      return defaultValue;
    }

    try {
      const storedValue = window.localStorage.getItem(key);

      // no stored value
      if (storedValue === null) {
        return defaultValue;
      }

      return JSON.parse(storedValue);
    } catch (e) {
      // silently fail if no localStorage or JSON parse fails
      return defaultValue;
    }
  });

  useEffect(() => {
    if (!key) {
      return;
    }

    try {
      // remove item from storage if it's the default option
      if (value === defaultValue) {
        window.localStorage.removeItem(key);
        return;
      }

      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // silently fail if no localStorage or JSON stringify fails
    }
  }, [key, value]);

  return [value, setValue];
}

export function useLanguages() {
  return useTypedSelector(({ languages }) => languages);
}

export function useSentences() {
  return useTypedSelector(({ sentences }) => sentences);
}

export function useAbortContributionModal() {
  return useTypedSelector(
    ({ abortContributionModal }) => abortContributionModal
  );
}
