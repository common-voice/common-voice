SELECT name, COUNT(DISTINCT client_id) AS count
  FROM clips
  JOIN locales ON clips.locale_id = locales.id AND name = ?
  GROUP BY locale_id