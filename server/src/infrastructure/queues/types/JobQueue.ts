import { Task } from 'fp-ts/Task'

export type JobQueue<T> = {
  addJob: (job: T) => Task<boolean>
}
