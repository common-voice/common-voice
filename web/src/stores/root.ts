import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import API from '../services/api';
import { trackProfile } from '../services/tracker';
import { Recordings } from './recordings';
import StateTree from './tree';
import { User } from './user';
import { Validations } from './validations';

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
  function root(
    { recordings, user, validations }: StateTree = {
      api: undefined,
      recordings: undefined,
      user: undefined,
      validations: undefined,
    },
    action: Recordings.Action | User.Action | Validations.Action
  ): StateTree {
    const newState = {
      recordings: Recordings.reducer(recordings, action as Recordings.Action),
      user: User.reducer(user, action as User.Action),
      validations: Validations.reducer(
        validations,
        action as Validations.Action
      ),
    };
    return { api: new API(newState.user), ...newState };
  },
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

const fieldTrackers: any = {
  email: () => trackProfile('give-email'),
  username: () => trackProfile('give-username'),
  accent: () => trackProfile('give-accent'),
  age: () => trackProfile('give-age'),
  gender: () => trackProfile('give-gender'),
};

let prevUser: User.State = null;
store.subscribe(() => {
  const user = (store.getState() as any).user as User.State;
  for (const field of Object.keys(fieldTrackers)) {
    const typedField = field as keyof User.State;
    if (prevUser && user[typedField] !== prevUser[typedField]) {
      fieldTrackers[typedField]();
    }
  }
  prevUser = user;

  localStorage[USER_KEY] = JSON.stringify(user);
});

export default store;
