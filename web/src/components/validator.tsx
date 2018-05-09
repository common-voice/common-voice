import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../stores/tree';
import ListenBox from './listen-box/listen-box';
import { Clips } from '../stores/clips';

interface PropsFromState {
  loadError: boolean;
  clip?: Clips.Clip;
}

interface PropsFromDispatch {
  vote: typeof Clips.actions.vote;
}

interface Props extends PropsFromState, PropsFromDispatch {}

export default connect<PropsFromState, PropsFromDispatch>(
  (state: StateTree) => ({
    clip: Clips.selectors.localeClips(state).next,
    loadError: Clips.selectors.localeClips(state).loadError,
  }),
  { vote: Clips.actions.vote }
)(({ loadError, clip, vote }: Props) => (
  <div className="validator">
    <ListenBox
      src={clip ? clip.audioSrc : ''}
      sentence={
        clip ? (
          clip.sentence
        ) : loadError ? (
          <Localized id="audio-loading-error">
            <span />
          </Localized>
        ) : (
          <Localized id="loading">
            <span />
          </Localized>
        )
      }
      onVote={vote}
      vote
    />
  </div>
));
