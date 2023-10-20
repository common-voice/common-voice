import { pipe } from "fp-ts/lib/function";
import { fetchAllClipsForLocale } from "../core/clips";
import { isMinorityLanguage } from "../core/ruleOfFive";
import { ProcessLocaleJob } from "../types";
import { taskEither as TE } from 'fp-ts'
import { Job } from "bullmq";

export const processLocale = async (job: Job<ProcessLocaleJob>) => {
    const locale = job.data.locale
    console.log('Starting to process locale', locale)
    fetchAllClipsForLocale(locale)
    await pipe(
        TE.Do,
        TE.bind('isMinorityLanguage', () => isMinorityLanguage(locale)),
        TE.tap(({isMinorityLanguage}) => TE.right(console.log(isMinorityLanguage)))
        // TE.bind('allClips', () => )
    )()
    
// query db for all clips
// download all clips from storage
// create clips.tsv
// create splits with corpora creator

}