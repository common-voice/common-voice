-- Get locales that have clips with licensed sentences
-- This optimizes the "licensed only" release by avoiding scanning all 300+ languages
SELECT DISTINCT
  l.name AS name,
  tt.term_name AS license
FROM clips c
INNER JOIN locales l ON l.id = c.locale_id
INNER JOIN taxonomy_entries te ON te.sentence_id = c.original_sentence_id
INNER JOIN taxonomy_terms tt ON te.term_id = tt.id
INNER JOIN taxonomies t ON tt.taxonomy_id = t.id
WHERE c.created_at BETWEEN ? AND ?
  AND t.tax_name = 'Licence'
GROUP BY l.name, tt.term_name
ORDER BY l.name, tt.term_name
