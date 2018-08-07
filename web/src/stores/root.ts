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
import { Notifications } from './notifications';
import { Uploads } from './uploads';

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

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  function root(
    {
      recordings,
      user,
      clips,
      requestedLanguages,
      locale,
      notifications,
      uploads,
    }: StateTree = {
      api: undefined,
      recordings: undefined,
      user: undefined,
      clips: undefined,
      requestedLanguages: undefined,
      locale: undefined,
      notifications: undefined,
      uploads: undefined,
    },
    action:
      | Recordings.Action
      | User.Action
      | Clips.Action
      | RequestedLanguages.Action
      | Locale.Action
      | Uploads.Action
  ): StateTree {
    const newState = {
      recordings: Recordings.reducer(
        locale,
        recordings,
        action as Recordings.Action
      ),
      user: User.reducer(user, action as User.Action),
      clips: Clips.reducer(locale, clips, action as Clips.Action),
      requestedLanguages: RequestedLanguages.reducer(
        requestedLanguages,
        action as RequestedLanguages.Action
      ),
      locale: Locale.reducer(locale, action as Locale.Action),
      notifications: Notifications.reducer(notifications, action as any),
      uploads: Uploads.reducer(uploads, action as Uploads.Action),
    };

    return { api: new API(newState.locale, newState.user), ...newState };
  },
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

store.dispatch(User.actions.update({}) as any);

const fieldTrackers: any = {
  email: () => trackProfile('give-email'),
  username: () => trackProfile('give-username'),
  accent: () => trackProfile('give-accent'),
  age: () => trackProfile('give-age'),
  gender: () => trackProfile('give-gender'),
};

let prevUser: User.State = null;
store.subscribe(() => {
  const { user } = store.getState();
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
      store.dispatch(User.actions.update(JSON.parse(storage.newValue)) as any);
    }
  });
}

export default store;
