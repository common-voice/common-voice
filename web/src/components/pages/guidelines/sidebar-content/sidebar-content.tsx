import React from 'react';

import { BackgoundNoise } from './voice-collection/background-noise';
import { BackgoundVoices } from './voice-collection/background-voices';
import { Effects } from './voice-collection/effects';
import { Misreadings } from './voice-collection/misreadings';
import { OffensiveContent } from './voice-collection/offensive-content';
import { Unsure } from './voice-collection/unsure';
import { VaryingPronounciation } from './voice-collection/varying-pronunciations';
import { Volume } from './voice-collection/volume';

const SidebarContent: React.FC = () => {
  return (
    <>
      <VaryingPronounciation />
      <OffensiveContent />
      <Misreadings />
      <BackgoundNoise />
      <BackgoundVoices />
      <Volume />
      <Effects />
      <Unsure />
    </>
  );
};

export default SidebarContent;
