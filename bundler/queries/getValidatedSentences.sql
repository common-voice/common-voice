SELECT
  s.id as sentence_id,
  REPLACE (text, '\r\n', ' ') AS sentence,
  COALESCE(metadata.domain, '') AS sentence_domain,
  COALESCE(s.source, '') as source,
  s.is_used,
  s.clips_count
FROM
  sentences s
  LEFT JOIN locales l ON l.id = s.locale_id
  LEFT JOIN (
    SELECT
      s.id as sentence_id,
      GROUP_CONCAT (d.domain) as domain
    FROM
      sentences s
      INNER JOIN sentence_domains sd ON sd.sentence_id = s.id
      INNER JOIN domains d ON sd.domain_id = d.id
    GROUP BY
      s.id
  ) metadata ON metadata.sentence_id = s.id
WHERE
  s.is_validated = 1
  AND l.name = ?
  AND (
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
          te.sentence_id = s.id
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
          te.sentence_id = s.id
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
