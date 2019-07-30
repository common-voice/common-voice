import { useContext } from 'react';
import { __RouterContext as RouterContext } from 'react-router';

export function useRouter() {
  return useContext(RouterContext);
}
