SELECT
  s.id as sentence_id,
  REPLACE(text, '\r\n', ' ') AS sentence,
  COALESCE(metadata.domain, '') AS sentence_domain,
  COALESCE(s.source, '') as source
FROM sentences s
LEFT JOIN locales l ON l.id = s.locale_id
LEFT JOIN (
  SELECT s.id as sentence_id, GROUP_CONCAT(d.domain) as domain
  FROM sentences s
    INNER JOIN sentence_domains sd ON sd.sentence_id = s.id
    INNER JOIN domains d ON sd.domain_id = d.id
  GROUP BY s.id
) metadata ON metadata.sentence_id = s.id
WHERE s.is_validated = 0
AND l.name = ?
