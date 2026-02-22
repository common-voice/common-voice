SELECT
  l.name AS locale,
  v.variant_token,
  v.variant_name,
  COUNT(DISTINCT c.id) AS clip_count
FROM clips c
INNER JOIN locales l ON l.id = c.locale_id
INNER JOIN user_client_variants ucv
  ON ucv.client_id = c.client_id AND ucv.locale_id = c.locale_id
INNER JOIN variants v ON v.id = ucv.variant_id
WHERE c.created_at BETWEEN ? AND ?
  AND v.variant_token IS NOT NULL
  AND v.variant_token != ''
GROUP BY l.name, v.variant_token, v.variant_name
ORDER BY clip_count DESC, l.name
