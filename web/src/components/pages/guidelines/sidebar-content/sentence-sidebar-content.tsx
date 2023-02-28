import React from 'react';
import { sentenceGuidelineSections } from '../constants';

const SentenceSidebarContent = () => {
  return (
    <>
      {sentenceGuidelineSections.map(section => (
        <section.component key={section.id} />
      ))}
    </>
  );
};

export default SentenceSidebarContent;
