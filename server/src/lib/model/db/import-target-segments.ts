import { getMySQLInstance } from './mysql';

const db = getMySQLInstance();

export async function importTargetSegments() {
  const [rows] = await db.query(`
      SELECT terms.id, term_name, term_sentence_source
      FROM taxonomy_terms terms
      INNER JOIN taxonomies tax ON terms.taxonomy_id = tax.id
      WHERE tax_name = "Target Segments"
      AND term_sentence_source IS NOT NULL`);

  const taxonomyQueries = rows.map(
    async (taxonomy: {
      id: number;
      term_name: string;
      term_sentence_source: string;
    }) => {
      console.log(
        `Importing sentences for taxonomy ${taxonomy.term_name} from source ${taxonomy.term_sentence_source}...`
      );

      await db.query(
        'INSERT IGNORE INTO taxonomy_entries (term_id, sentence_id) SELECT ?, id FROM sentences WHERE source = ?',
        [taxonomy.id, taxonomy.term_sentence_source]
      );
    }
  );

  await Promise.all(taxonomyQueries);
}
