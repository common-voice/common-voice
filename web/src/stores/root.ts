import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import Tracker from '../services/tracker';
import recordings from './recordings';
import StateTree from './tree';
import user, { UserState } from './user';

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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers<StateTree>({ recordings, user }),
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
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
