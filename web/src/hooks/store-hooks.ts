import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
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
