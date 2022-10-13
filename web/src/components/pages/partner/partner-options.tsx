import React from 'react';

export const PARTNER_OPTIONS = [
  {
    id: 'community',
    elems: {
      about: <a href="about">About</a>,
      community: (
        <a
          href="https://common-voice.github.io/community-playbook"
          target="_blank"
          rel="noreferrer">
          Community playbook
        </a>
      ),
      emailFragment: (
        <a
          href="mailto:commonvoice@mozilla.com?subject=Partnership - community"
          target="_blank"
          rel="noreferrer">
          get in touch.
        </a>
      ),
    },
  },
  {
    id: 'foundations',
    elems: {
      programmaticWork: (
        <a
          href="https://foundation.mozilla.org/en/common-voice/in-country-programmes"
          target="_blank"
          rel="noreferrer">
          programmatic work
        </a>
      ),
    },
  },
  {
    id: 'governments',
    elems: {
      emailFragment: (
        <a
          href="mailto:commonvoice@mozilla.com?subject=Partnership - governments"
          target="_blank"
          rel="noreferrer">
          get in touch.
        </a>
      ),
    },
  },
  {
    id: 'academia',
    elems: {
      emailFragment: (
        <a
          href="mailto:commonvoice@mozilla.com?subject=Partnership - academics"
          target="_blank"
          rel="noreferrer">
          reach out.
        </a>
      ),
    },
  },
  {
    id: 'small-business',
    elems: {
      emailFragment: (
        <a
          href="mailto:commonvoice@mozilla.com?subject=Partnership - business"
          target="_blank"
          rel="noreferrer">
          hear from you.
        </a>
      ),
    },
  },
  {
    id: 'corporates',
    elems: {
      emailFragment: (
        <a
          href="mailto:commonvoice@mozilla.com?subject=Partnership - corporates"
          target="_blank"
          rel="noreferrer">
          drop us a line.
        </a>
      ),
    },
  },
];
