import { combineReducers, createStore } from 'redux';
import { createSelector } from 'reselect';
import API from '../services/api';
import Tracker from '../services/tracker';
import user, { UserState } from './user';

export const apiSelector = createSelector(
  (state: any) => state.user,
  user => new API(user)
);

const USER_KEY = 'userdata';

let preloadedState = null;
try {
  preloadedState = {
    user: JSON.parse(localStorage.getItem(USER_KEY)) || undefined,
  };
} catch (e) {
  console.error('failed parsing storage', e);
  localStorage.removeItem(USER_KEY);
}

const store = createStore(
  combineReducers({ user }),
  preloadedState,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

const tracker = new Tracker();
const fieldTrackers: any = {
  email: () => tracker.trackGiveEmail(),
  username: () => tracker.trackGiveUsername(),
  accent: () => tracker.trackGiveAccent(),
  age: () => tracker.trackGiveAge(),
  gender: () => tracker.trackGiveGender(),
};

let prevUser: UserState = null;
store.subscribe(() => {
  const user = (store.getState() as any).user as UserState;
  for (const field of Object.keys(fieldTrackers)) {
    const typedField = field as keyof UserState;
    if (!prevUser || user[typedField] !== prevUser[typedField]) {
      fieldTrackers[typedField]();
    }
  }
  prevUser = user;

  localStorage[USER_KEY] = JSON.stringify(user);
});

export default store;
