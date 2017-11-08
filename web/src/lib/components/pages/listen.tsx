import * as React from 'react';
import API from '../../api';
import Validator from '../validator';
import User from '../../user';
import { RouteComponentProps } from 'react-router';

interface ListenPageProps extends RouteComponentProps<any> {
  user: User;
  api: API;
}

export default class Listen extends React.Component<ListenPageProps, {}> {
  constructor(props: ListenPageProps) {
    super(props);
    this.onVote = this.onVote.bind(this);
  }

  onVote() {
    this.props.user.tallyVerification();
  }

  render() {
    return (
      <div id="listen-container">
        <Validator onVote={this.onVote} api={this.props.api} />
      </div>
    );
  }
}
