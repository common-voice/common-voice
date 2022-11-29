/*
  Note: When you release a new dataset, please make sure
  to add it to the datasets table as well

  The files are stored in web/releases. These get copied by
  Webpack into our dist/ folder.
*/

export const RELEASES = [
  { id: 'cv-corpus-11.0-2022-09-21', name: 'Common Voice Corpus 11.0' },
  { id: 'cv-corpus-10.0-2022-07-04', name: 'Common Voice Corpus 10.0' },
  { id: 'cv-corpus-9.0-2022-04-27', name: 'Common Voice Corpus 9.0' },
  { id: 'cv-corpus-8.0-2022-01-19', name: 'Common Voice Corpus 8.0' },
  { id: 'cv-corpus-7.0-2021-07-21', name: 'Common Voice Corpus 7.0' },
  { id: 'cv-corpus-6.1-2020-12-11', name: 'Common Voice Corpus 6.1' },
  { id: 'cv-corpus-5.1-2020-06-22', name: 'Common Voice Corpus 5.1' },
  { id: 'cv-corpus-4-2019-12-10', name: 'Common Voice Corpus 4.0' },
  { id: 'cv-corpus-3', name: 'Common Voice Corpus 3.0' },
  { id: 'cv-corpus-2', name: 'Common Voice Corpus 2.0' },
  { id: 'cv-corpus-1', name: 'Common Voice Corpus 1.0' },
];
export const SEGMENT_RELEASE_ID = 'cv-corpus-7.0-singleword';
export const CURRENT_RELEASE_ID = RELEASES[0].id;

export async function getRelease(id: string) {
  const response = await fetch(`/dist/releases/${id}.json`);
  const data = await response.json();
  return data;
}
