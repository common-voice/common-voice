import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import API from '../services/api';
import Tracker from '../services/tracker';
import { Recordings } from './recordings';
import StateTree from './tree';
import { User } from './user';
import { isBrowser } from '../utility';
import { Validations } from './validations';

const USER_KEY = 'userdata';

let preloadedState: StateTree = {
  api: undefined,
  recordings: undefined,
  user: undefined,
  validations: undefined,
};

const composeEnhancers =
  (isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

interface MergeAction {
  type: 'MERGE';
  state: StateTree;
}

const store = createStore(
  function root(
    { recordings, user, validations }: StateTree,
    action: MergeAction | Recordings.Action | User.Action | Validations.Action
  ): StateTree {
    const newState = {
      recordings: Recordings.reducer(recordings, action as Recordings.Action),
      user: User.reducer(user, action as User.Action),
      validations: Validations.reducer(
        validations,
        action as Validations.Action
      ),
    };
    return {
      api: new API(newState.user),
      ...newState,
      ...action.type == 'MERGE' ? action.state : null,
    };
  },
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

if (isBrowser) {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY)) || undefined;
    if (user) {
      store.dispatch({
        type: 'MERGE',
        state: { user },
      });
    }
  } catch (e) {
    console.error('failed parsing storage', e);
    localStorage.removeItem(USER_KEY);
  }
}

const tracker = new Tracker();
const fieldTrackers: any = {
  email: () => tracker.trackGiveEmail(),
  username: () => tracker.trackGiveUsername(),
  accent: () => tracker.trackGiveAccent(),
  age: () => tracker.trackGiveAge(),
  gender: () => tracker.trackGiveGender(),
};

let prevUser: User.State = null;
store.subscribe(() => {
  const user = (store.getState() as any).user as User.State;
  for (const field of Object.keys(fieldTrackers)) {
    const typedField = field as keyof User.State;
    if (!prevUser || user[typedField] !== prevUser[typedField]) {
      fieldTrackers[typedField]();
    }
  }
  prevUser = user;

  localStorage[USER_KEY] = JSON.stringify(user);
});

export default store;
