export const up = async function (db: any): Promise<any> {
  // Note: Manual backfill to follow.
  return db.runSql(`
  	CREATE TABLE datasets (
  		id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  		name VARCHAR(255) NOT NULL,
  		release_dir VARCHAR(255) DEFAULT NULL,
  		multilingual BOOLEAN DEFAULT TRUE,
  		bundle_date DATE DEFAULT NULL,
  		release_date DATE DEFAULT NULL,
  		UNIQUE (release_dir),
  		KEY (multilingual),
  		KEY (release_date)
  	);

  	ALTER TABLE downloaders
      ADD COLUMN dataset_id INT UNSIGNED,
      ADD CONSTRAINT FOREIGN KEY (dataset_id) REFERENCES datasets(id),
      DROP KEY email,
      ADD CONSTRAINT unique_download UNIQUE KEY (email, locale_id, dataset_id);

    INSERT INTO datasets(name, release_dir, multilingual, bundle_date, release_date)
    	VALUES
	    	('Common Voice Corpus 1', 'cv-corpus-1', TRUE, '2019-02-25', '2019-02-25'),
	    	('Common Voice Corpus 2', 'cv-corpus-2', TRUE, '2019-06-11', '2019-06-11'),
	    	('Common Voice Corpus 3', 'cv-corpus-3', TRUE, '2019-06-24', '2019-06-24'),
	    	('Common Voice Corpus 4', 'cv-corpus-4-2019-12-10', TRUE, '2019-12-10', '2020-01-14'),
	    	('Common Voice Corpus 5', 'cv-corpus-5-2020-06-22', TRUE, '2020-06-22', '2020-06-30'),
	    	('Common Voice Singleword Segment', 'cv-corpus-5-singleword', FALSE, '2020-06-22', '2020-06-30'),

  `);
};

export const down = function (): Promise<any> {
  return null;
};
