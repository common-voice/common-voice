SELECT
  name,
  COUNT(DISTINCT client_id) AS count
FROM
  clips
  JOIN locales ON clips.locale_id = locales.id
  AND name = ?
WHERE
  (
    -- For unlicensed (NULL): exclude sentences with any license
    (
      ? IS NULL
      AND NOT EXISTS (
        SELECT
          1
        FROM
          taxonomy_entries te
          INNER JOIN taxonomy_terms tt ON te.term_id = tt.id
        WHERE
          te.sentence_id = clips.original_sentence_id
          AND tt.taxonomy_id = (
            SELECT
              id
            FROM
              taxonomies
            WHERE
              tax_name = 'Licence'
          )
      )
    )
    OR
    -- For a specific license: only include sentences with that exact license
    (
      ? IS NOT NULL
      AND EXISTS (
        SELECT
          1
        FROM
          taxonomy_entries te
          INNER JOIN taxonomy_terms tt ON te.term_id = tt.id
        WHERE
          te.sentence_id = clips.original_sentence_id
          AND tt.taxonomy_id = (
            SELECT
              id
            FROM
              taxonomies
            WHERE
              tax_name = 'Licence'
          )
          AND tt.term_name = ?
      )
    )
  )
GROUP BY
  locale_id
