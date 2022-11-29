import { TypedUseSelectorHook, useSelector } from 'react-redux';
import API from '../services/api';
import { Clips } from './clips';
import { Flags } from './flags';
import { Notifications } from './notifications';
import * as Languages from './languages';
import { Sentences } from './sentences';
import { RequestedLanguages } from './requested-languages';
import { Uploads } from './uploads';
import { User } from './user';

export default interface StateTree {
  api: API;
  clips: Clips.State;
  flags: Flags.State;
  notifications: Notifications.State;
  languages: Languages.State;
  locale: string;
  requestedLanguages: RequestedLanguages.State;
  sentences: Sentences.State;
  uploads: Uploads.State;
  user: User.State;
}

export const useTypedSelector: TypedUseSelectorHook<StateTree> = useSelector;
