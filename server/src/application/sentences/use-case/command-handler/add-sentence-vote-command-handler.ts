import { insertSentenceVoteIntoDb } from '../../repository/sentences-repository'
import { AddSentenceVoteCommand } from './command/add-sentence-vote-command'

export const addSentenceVoteCommandHandler = (
  command: AddSentenceVoteCommand
) => insertSentenceVoteIntoDb(command)
