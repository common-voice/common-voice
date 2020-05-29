const locales = require('locales/all.json') as string[];
import { getMySQLInstance } from './mysql';

const db = getMySQLInstance();

export async function importTaxonomies() {
	const taxonomies = [
		{
			termName: 'Benchmark',
			sourceName: 'singelword-benchmark'
		},
	]

	const taxonomyQueries = taxonomies.map(async (taxonomy) => {
		console.log(`Importing sentences for taxonomy ${taxonomy.termName} from source ${taxonomy.sourceName}...`);

		const [termId] = await db.query('SELECT id FROM taxonomy_terms WHERE term_name = ?', [
	    taxonomy.termName
	  ]);

		await db.query('INSERT IGNORE INTO taxonomy_entries (term_id, sentence_id) SELECT ?, id FROM sentences WHERE source = ?', [
	    termId, taxonomy.sourceName
	  ]);
	});

	await Promise.all(taxonomyQueries);
}
