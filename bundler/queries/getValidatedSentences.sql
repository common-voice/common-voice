SELECT
  s.id as sentence_id,
  REPLACE(text, '\r\n', ' ') AS sentence,
  COALESCE(metadata.domain, '') AS sentence_domain,
  COALESCE(s.source, '') as source,
  s.is_used,
  s.clips_count
FROM sentences s
LEFT JOIN locales l ON l.id = s.locale_id
LEFT JOIN (
  SELECT sm.sentence_id, domain
  FROM sentence_metadata sm
  LEFT JOIN sentence_domains sd ON sd.id = sm.domain_id
) metadata ON metadata.sentence_id = s.id
WHERE s.is_validated = 1
AND l.name = ?
