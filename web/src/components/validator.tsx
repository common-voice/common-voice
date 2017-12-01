import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../stores/tree';
import ListenBox from './listen-box/listen-box';
import { Validations } from '../stores/validations';

const LOADING_MESSAGE = 'Loading...';
const LOAD_ERROR_MESSAGE =
  'Sorry! We are processing our audio files, please try again shortly.';

interface PropsFromState {
  loadError: boolean;
  validation?: Validations.Validation;
}

interface PropsFromDispatch {
  vote: typeof Validations.actions.vote;
}

interface Props extends PropsFromState, PropsFromDispatch {}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ api, validations }: StateTree) => ({
    validation: validations.next,
    loadError: validations.loadError,
  }),
  { vote: Validations.actions.vote }
)(({ loadError, validation, vote }: Props) => (
  <div className="validator">
    <ListenBox
      src={validation ? validation.audioSrc : ''}
      sentence={
        validation
          ? validation.sentence
          : loadError ? LOAD_ERROR_MESSAGE : LOADING_MESSAGE
      }
      onVote={vote}
      vote
    />
  </div>
));
