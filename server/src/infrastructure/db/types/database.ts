import { taskEither as TE } from 'fp-ts'

export type DatabaseQuery<T> = (
  query: string
) => (params: Array<string | number | boolean>) => TE.TaskEither<Error, T>
