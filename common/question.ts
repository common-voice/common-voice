import { Sentence ,Clip} from './clips';



export type Questions = {
  id: number
  question: Sentence
  responses: Response[] 
}

export type Response = {
  clip: Clip 
  variants: string[] 
  id: number 
}