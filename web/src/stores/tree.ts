import { RecordingsState } from './recordings';
import { UserState } from './user';

export default interface StateTree {
  recordings: RecordingsState;
  user: UserState;
};
