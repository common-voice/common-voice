import { Job } from 'bull';
import Clips from '../../model/clips';

const getClipsWithoutDurations = async (job: Job) => {
  console.log('Getting clips without durations...');
  const clipsToProcess = await Clips.getBatchClipPathWithoutDuration(1000);
  console.log('clipsToProcess', clipsToProcess);
  return clipsToProcess;
};

const calcualteClipDuration = (clip: any) => {};

const clipProcessor = async (job: Job) => {
  console.log('job', job.id);
  await getClipsWithoutDurations(job);
  return true;
};

export default clipProcessor;
