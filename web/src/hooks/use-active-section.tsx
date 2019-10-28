var throttle = require('lodash.throttle');
import { useState, useEffect } from 'react';

type SectionMap = {
  [key: string]: number;
};

export default function useActiveSection(sections: any): string {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionMap: SectionMap = {};

  const handleSectionUpdate = () => {
    let scrollMap = Object.entries(sectionMap);

    scrollMap.sort((a: any[], b: any[]) => a[1] - b[1]);

    if (scrollMap[0] && scrollMap[0][0] !== activeSection) {
      setActiveSection(scrollMap[0][0]);
    }
  };

  const throttledHandleSectionUpdate = throttle(handleSectionUpdate, 200);

  const intersectionObserverCallback = (entries: any[]) => {
    entries.forEach(e => {
      sectionMap[e.target.id] = e.boundingClientRect.top;

      if (!e.isIntersecting || e.intersectionRatio < 0.02) {
        delete sectionMap[e.target.id];
      }
    });

    throttledHandleSectionUpdate();
  };

  useEffect(() => {
    const sectionsElements: HTMLElement[] = sections
      .map((s: string) => document.getElementById(s))
      .filter((e: HTMLElement) => !!e);
    const observer = new IntersectionObserver(intersectionObserverCallback, {
      threshold: [
        0,
        0.01,
        0.02,
        0.03,
        0.04,
        0.05,
        0.06,
        0.07,
        0.08,
        0.09,
        0.1,
        0.9,
        0.91,
        0.92,
        0.93,
        0.94,
        0.95,
        0.96,
        0.97,
        0.98,
        0.99,
        1,
      ],
      rootMargin: '-20%',
    });

    sectionsElements.map((e: HTMLElement) => observer.observe(e));

    return () => {
      sectionsElements.map((e: HTMLElement) => observer.unobserve(e));
    };
  });

  return activeSection;
}
