import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../stores/tree';
import ListenBox from './listen-box/listen-box';
import { Clips } from '../stores/clips';

const LOADING_MESSAGE = 'Loading...';
const LOAD_ERROR_MESSAGE =
  'Sorry! We are processing our audio files, please try again shortly.';

interface PropsFromState {
  loadError: boolean;
  clip?: Clips.Clip;
}

interface PropsFromDispatch {
  vote: typeof Clips.actions.vote;
}

interface Props extends PropsFromState, PropsFromDispatch {}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ clips }: StateTree) => ({
    clip: clips.next,
    loadError: clips.loadError,
  }),
  { vote: Clips.actions.vote }
)(({ loadError, clip, vote }: Props) => (
  <div className="validator">
    <ListenBox
      src={clip ? clip.audioSrc : ''}
      sentence={
        clip ? clip.sentence : loadError ? LOAD_ERROR_MESSAGE : LOADING_MESSAGE
      }
      onVote={vote}
      vote
    />
  </div>
));
