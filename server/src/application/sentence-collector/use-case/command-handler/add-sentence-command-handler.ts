import { validateSentence } from "../../../../core/sentence-collector";
import { AddSentenceCommand } from "./command/add-sentence-command";

export default (command: AddSentenceCommand) => {
  return validateSentence('en')(command.sentence);
}
