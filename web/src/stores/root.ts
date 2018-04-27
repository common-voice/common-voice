import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import API from '../services/api';
import { trackProfile } from '../services/tracker';
import { Recordings } from './recordings';
import StateTree from './tree';
import { User } from './user';
import { Clips } from './clips';
import { RequestedLanguages } from './requested-languages';
import { Locale } from './locale';

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
    { recordings, user, clips, requestedLanguages, locale }: StateTree = {
      api: undefined,
      recordings: undefined,
      user: undefined,
      clips: undefined,
      requestedLanguages: undefined,
      locale: undefined,
    },
    action:
      | Recordings.Action
      | User.Action
      | Clips.Action
      | RequestedLanguages.Action
      | Locale.Action
  ): StateTree {
    const newState = {
      recordings: Recordings.reducer(recordings, action as Recordings.Action),
      user: User.reducer(user, action as User.Action),
      clips: Clips.reducer(clips, action as Clips.Action),
      requestedLanguages: RequestedLanguages.reducer(
        requestedLanguages,
        action as RequestedLanguages.Action
      ),
      locale: Locale.reducer(locale, action as Locale.Action),
    };

    return { api: new API(newState.locale, newState.user), ...newState };
  },
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

[
  User.actions.update({}),
  Clips.actions.refillCache(),
  Recordings.actions.buildNewSentenceSet(),
].forEach(store.dispatch.bind(store));

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

// Only check for storage events in non-IE browsers, as it misfires in IE
if (!(document as any).documentMode) {
  window.addEventListener('storage', (storage: StorageEvent) => {
    if (storage.key === USER_KEY) {
      store.dispatch(User.actions.update(JSON.parse(storage.newValue)));
    }
  });
}

export default store;
