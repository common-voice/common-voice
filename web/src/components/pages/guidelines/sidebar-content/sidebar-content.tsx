import React from 'react';

import { NAV_IDS } from '../constants';
import { BackgoundNoise } from './voice-collection/background-noise';
import { BackgoundVoices } from './voice-collection/background-voices';
import { Effects } from './voice-collection/effects';
import { Misreadings } from './voice-collection/misreadings';
import { OffensiveContent } from './voice-collection/offensive-content';
import { Unsure } from './voice-collection/unsure';
import { VaryingPronounciation } from './voice-collection/varying-pronunciations';
import { Volume } from './voice-collection/volume';

type SidebarContentProps = {
  id: string;
};

export const voiceCollectionTabs = [
  {
    title: NAV_IDS.PRONUNCIATIONS,
    component: VaryingPronounciation,
  },
  {
    title: NAV_IDS.OFFENSIVE_CONTENT,
    component: OffensiveContent,
  },
  {
    title: NAV_IDS.MISREADINGS,
    component: Misreadings,
  },
  {
    title: NAV_IDS.BACKGROUND_NOISE,
    component: BackgoundNoise,
  },
  {
    title: NAV_IDS.BACKGROUND_VOICES,
    component: BackgoundVoices,
  },
  {
    title: NAV_IDS.VOLUME,
    component: Volume,
  },
  {
    title: NAV_IDS.EFFECTS,
    component: Effects,
  },
  {
    title: NAV_IDS.UNSURE,
    component: Unsure,
  },
];

const SidebarContent: React.FC<SidebarContentProps> = ({ id }) => {
  const Tab = voiceCollectionTabs.find(el => el.title === id);

  return <Tab.component />;
};

export default SidebarContent;
