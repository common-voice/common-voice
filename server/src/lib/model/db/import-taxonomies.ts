import { getMySQLInstance } from './mysql';
import { TaxonomyToken, taxonomies } from 'common';
const db = getMySQLInstance();

export async function importTaxonomies() {
  const taxonomyQueries = Object.keys(taxonomies).map(
    async (taxonomyToken: TaxonomyToken) => {
      const taxonomy = taxonomies[taxonomyToken];
      console.log(
        `Importing sentences for taxonomy ${taxonomy.name} from source ${taxonomy.source}...`
      );

      const [termId] = await db.query(
        'SELECT id FROM taxonomy_terms WHERE term_sentence_source = ?',
        [taxonomy.source]
      );

      await db.query(
        'INSERT IGNORE INTO taxonomy_entries (term_id, sentence_id) SELECT ?, id FROM sentences WHERE source = ?',
        [termId, taxonomy.source]
      );
    }
  );

  await Promise.all(taxonomyQueries);
}
