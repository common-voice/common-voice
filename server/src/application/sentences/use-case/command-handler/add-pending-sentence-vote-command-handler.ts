import { insertPendingSentenceVoteIntoDb } from '../../repository/sentences-repository'
import { AddPendingSentenceVoteCommand } from './command/add-pending-sentence-vote-command'

export const addPendingSentenceVoteCommandHandler = (
  command: AddPendingSentenceVoteCommand
) => insertPendingSentenceVoteIntoDb(command)
