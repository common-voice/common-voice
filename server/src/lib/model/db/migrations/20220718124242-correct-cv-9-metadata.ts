export const up = async function (db: any): Promise<any> {
  return db.runSql(`
  UPDATE datasets 
  SET release_dir = 'cv-corpus-9.0-2022-04-27'
  WHERE name = 'Common Voice Corpus 9.0' and release_dir = 'cv-corpus-9.0-2022-01-19'
  `);
};

export const down = function (): Promise<any> {
  return null;
};
