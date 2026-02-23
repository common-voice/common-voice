SELECT
  s.id as sentence_id,
  REPLACE (text, '\r\n', ' ') AS sentence,
  COALESCE(
    (SELECT v.variant_token
     FROM sentence_metadata sm
     JOIN variants v ON v.id = sm.variant_id
     WHERE sm.sentence_id = s.id
     LIMIT 1),
    ''
  ) AS variant,
  COALESCE(
    (SELECT GROUP_CONCAT(DISTINCT d.domain)
     FROM sentence_domains sd
     JOIN domains d ON sd.domain_id = d.id
     WHERE sd.sentence_id = s.id),
    ''
  ) AS sentence_domain,
  COALESCE(s.source, '') as source,
  COALESCE(vs.up_votes, 0) AS up_votes,
  COALESCE(vs.down_votes, 0) AS down_votes,
  CASE
    WHEN COALESCE(vs.down_votes, 0) >= 2
     AND COALESCE(vs.down_votes, 0) > COALESCE(vs.up_votes, 0)
    THEN 'rejected'
    ELSE 'pending'
  END AS status
FROM
  sentences s
  JOIN locales l ON l.id = s.locale_id
  LEFT JOIN (
    SELECT
      sentence_id,
      SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) AS up_votes,
      SUM(CASE WHEN vote = 0 THEN 1 ELSE 0 END) AS down_votes
    FROM
      sentence_votes
    GROUP BY
      sentence_id
  ) vs ON vs.sentence_id = s.id
WHERE
  s.is_validated = 0
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
