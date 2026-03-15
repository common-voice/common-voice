SELECT
    l.name AS name,
    COUNT(v.id) AS vote_count
FROM
    votes v
JOIN
    clips c ON c.id = v.clip_id
JOIN
    locales l ON l.id = c.locale_id
WHERE v.created_at BETWEEN ? AND ?
  AND l.is_contributable = 1
GROUP BY
    l.name
ORDER BY
    vote_count DESC
