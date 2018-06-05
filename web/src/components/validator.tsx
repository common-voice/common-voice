import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../stores/tree';
import ListenBox from './listen-box/listen-box';
import { Clips } from '../stores/clips';
import URLS from '../urls';
import { LocaleLink } from './locale-helpers';

interface PropsFromState {
  isLoading: boolean;
  clip?: Clips.Clip;
}

interface PropsFromDispatch {
  vote: typeof Clips.actions.vote;
}

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {}

const Validator = ({ clip, getString, isLoading, vote }: Props) => (
  <div className="validator">
    <ListenBox
      src={clip ? clip.audioSrc : ''}
      sentence={
        clip ? (
          clip.sentence
        ) : isLoading ? (
          <Localized id="loading">
            <span />
          </Localized>
        ) : (
          <Localized id="no-clips-to-validate">
            <span />
          </Localized>
        )
      }
      showSpeakButton={!clip && !isLoading}
      onVote={vote}
      vote
    />
  </div>
);

export default connect<PropsFromState, PropsFromDispatch>(
  (state: StateTree) => {
    const { next, isLoading } = Clips.selectors.localeClips(state);
    return {
      clip: next,
      isLoading,
    };
  },
  { vote: Clips.actions.vote }
)(withLocalization(Validator));
