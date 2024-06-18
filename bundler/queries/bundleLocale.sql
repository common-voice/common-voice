SELECT
  clips.id,
  clips.client_id,
  path,
  original_sentence_id as sentence_id,
  REPLACE(sentence, '\r\n', ' ') AS sentence,
  COALESCE(sentence_domains.domain, '') AS sentence_domain,
  COALESCE(SUM(votes.is_valid), 0) AS up_votes,
  COALESCE(SUM(NOT votes.is_valid), 0) AS down_votes,
  COALESCE(age, '') AS age,
  COALESCE(gender, '') AS gender,
  COALESCE(client_accent_list.accent_list, '') as accents,
  COALESCE(client_variant.variant, '') AS variant,
  locales.name AS locale,
  COALESCE(terms.term_name, '') AS segment
FROM clips
  LEFT JOIN votes ON clips.id = votes.clip_id
  LEFT JOIN user_client_accents accents ON clips.client_id = accents.client_id
  AND accents.locale_id = clips.locale_id
  -- A subquery that makes list of individual users accents
  LEFT JOIN (
    SELECT uca.client_id,
      uca.locale_id,
      GROUP_CONCAT(a.accent_name) as accent_list
    FROM user_client_accents uca
      JOIN accents a ON a.id = uca.accent_id
    WHERE a.accent_name != 'unspecified'
      and a.accent_name != ''
    GROUP BY uca.locale_id,
      uca.client_id
  ) client_accent_list ON clips.client_id = client_accent_list.client_id
  and client_accent_list.locale_id = clips.locale_id
  LEFT JOIN locales ON clips.locale_id = locales.id
  -- Get users variant for clips locale
  LEFT JOIN (
    SELECT ucv.client_id,
      ucv.locale_id,
      v.variant_name as variant
    FROM user_client_variants ucv
      JOIN variants v ON v.id = ucv.variant_id
  ) client_variant ON clips.client_id = client_variant.client_id AND clips.locale_id = client_variant.locale_id
  -- A subquery for taxonomies is faster than a full join
  LEFT JOIN (
    SELECT sentence_id,
      term_name
    FROM taxonomy_entries
      INNER JOIN taxonomy_terms ON taxonomy_entries.term_id = taxonomy_terms.id
  ) terms ON clips.original_sentence_id = terms.sentence_id
  -- A subquery for demographics is faster than a full join
  LEFT JOIN (
    SELECT clip_demographics.clip_id,
      ages.age,
      genders.gender
    FROM clip_demographics
      LEFT JOIN demographics ON clip_demographics.demographic_id = demographics.id
      LEFT JOIN ages ON demographics.age_id = ages.id
      LEFT JOIN genders ON demographics.gender_id = genders.id
  ) demographics ON clips.id = demographics.clip_id
  -- A subquery for sentence domains is faster than a full join
  LEFT JOIN (
    SELECT s.id as sentence_id, GROUP_CONCAT(d.domain) as domain
    FROM sentences s
      INNER JOIN sentence_domains sd ON sd.sentence_id = s.id
      INNER JOIN domains d ON sd.domain_id = d.id
    GROUP BY s.id
  ) sentence_domains ON clips.original_sentence_id = sentence_domains.sentence_id
WHERE clips.created_at BETWEEN ? AND ?
AND locales.name = ?
GROUP BY clips.id
