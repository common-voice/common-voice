SELECT
    l.name AS name,
    COUNT(c.id) AS clip_count
FROM
    clips c
JOIN
    locales l ON l.id = c.locale_id
WHERE c.created_at BETWEEN ? AND ?
GROUP BY
    l.name
ORDER BY
    clip_count DESC
