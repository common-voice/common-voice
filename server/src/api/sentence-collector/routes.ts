import addSentenceHandler from './handler/add-sentence-handler';
import getSentenceHandler from './handler/get-sentence-handler';
import PromiseRouter from 'express-promise-router';

export default PromiseRouter({ mergeParams: true })
  .post('/', addSentenceHandler)
  .get('/', getSentenceHandler)

