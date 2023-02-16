import { BackgoundNoise } from './sidebar-content/voice-collection/background-noise';
import { BackgoundVoices } from './sidebar-content/voice-collection/background-voices';
import { Effects } from './sidebar-content/voice-collection/effects';
import { Misreadings } from './sidebar-content/voice-collection/misreadings';
import { OffensiveContent } from './sidebar-content/voice-collection/offensive-content';
import { Unsure } from './sidebar-content/voice-collection/unsure';
import { VaryingPronounciation } from './sidebar-content/voice-collection/varying-pronunciations';
import { Volume } from './sidebar-content/voice-collection/volume';

export const NAV_IDS: Record<string, string> = {
  PRONUNCIATIONS: 'varying-pronunciations',
  OFFENSIVE_CONTENT: 'offensive-content',
  MISREADINGS: 'misreadings',
  BACKGROUND_NOISE: 'background-noise',
  BACKGROUND_VOICES: 'background-voices',
  VOLUME: 'volume',
  EFFECTS: 'reader-effects',
  UNSURE: 'just-unsure',
};

export const guidelinesSections = [
  {
    id: NAV_IDS.PRONUNCIATIONS,
    component: VaryingPronounciation,
    visible: true,
  },
  {
    id: NAV_IDS.OFFENSIVE_CONTENT,
    component: OffensiveContent,
    visible: true,
  },
  {
    id: NAV_IDS.MISREADINGS,
    component: Misreadings,
    visible: true,
  },
  {
    id: NAV_IDS.BACKGROUND_NOISE,
    component: BackgoundNoise,
    visible: true,
  },
  {
    id: NAV_IDS.BACKGROUND_VOICES,
    component: BackgoundVoices,
    visible: true,
  },
  {
    id: NAV_IDS.VOLUME,
    component: Volume,
    visible: true,
  },
  {
    id: NAV_IDS.EFFECTS,
    component: Effects,
    visible: true,
  },
  {
    id: NAV_IDS.UNSURE,
    component: Unsure,
    visible: true,
  },
];
