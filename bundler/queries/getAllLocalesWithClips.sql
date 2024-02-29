SELECT
    l.name AS name
FROM
    clips c
JOIN
    locales l ON l.id = c.locale_id
WHERE c.created_at BETWEEN ? AND ?
GROUP BY
    l.name