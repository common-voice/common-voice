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
import { AbortContributionModalState } from './abort-contribution-modal';
import { DonateBannerState } from './donate-banner';

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
  abortContributionModal: AbortContributionModalState;
  donateBanner: DonateBannerState;
}

export const useTypedSelector: TypedUseSelectorHook<StateTree> = useSelector;
