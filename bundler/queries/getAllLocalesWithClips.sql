SELECT
    l.name AS locale
FROM
    clips c
JOIN
    locales l ON l.id = c.locale_id
GROUP BY
    l.name