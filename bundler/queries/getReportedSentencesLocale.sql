SELECT 
    REPLACE(text, '\r\n', ' ') AS sentence,
    sentence_id,
    locales.name AS locale,
    reason
FROM reported_sentences
LEFT JOIN sentences ON reported_sentences.sentence_id = sentences.id
LEFT JOIN locales ON sentences.locale_id = locales.id 

WHERE reported_sentences.created_at BETWEEN ? AND ?
AND locales.name = ?
AND (
    -- For unlicensed (NULL): exclude sentences with any license
    (? IS NULL AND NOT EXISTS (
        SELECT 1 FROM taxonomy_entries te
        INNER JOIN taxonomy_terms tt ON te.term_id = tt.id
        WHERE te.sentence_id = reported_sentences.sentence_id
            AND tt.taxonomy_id = (SELECT id FROM taxonomies WHERE tax_name = 'Licence')
    ))
    OR
    -- For a specific license: only include sentences with that exact license
    (? IS NOT NULL AND EXISTS (
        SELECT 1 FROM taxonomy_entries te
        INNER JOIN taxonomy_terms tt ON te.term_id = tt.id
        WHERE te.sentence_id = reported_sentences.sentence_id
            AND tt.taxonomy_id = (SELECT id FROM taxonomies WHERE tax_name = 'Licence')
            AND tt.term_name = ?
    ))
)
