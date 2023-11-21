SELECT 
    REPLACE(text, '\r\n', ' ') AS sentence,
    sentence_id,
    locales.name AS locale,
    reason
FROM reported_sentences
LEFT JOIN sentences ON reported_sentences.sentence_id = sentences.id
LEFT JOIN locales ON sentences.locale_id = locales.id 
WHERE reported_sentences.created_at BETWEEN ? AND ?
AND locales.name = ?