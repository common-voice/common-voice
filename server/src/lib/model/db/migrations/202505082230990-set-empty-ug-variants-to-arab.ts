/**
 * This SQL is executed in two parts:
 *
 * 1. EXISTING rows in sentence_metadata that match sentences for the locale
 *    have their variant_id updated
 *
 * 2. NEW rows are INSERTED into sentence_metadata if a corresponding id
 *    does not already exist in sentence_metadata
 *
 */
export const up = async function (db: any): Promise<any> {
  /**
   * Part 1 - Existing rows
   */
  await db.runSql(`
    UPDATE sentence_metadata sm
    JOIN sentences s ON sm.sentence_id = s.id
    SET sm.variant_id = (
        SELECT v.id 
        FROM variants v
        WHERE v.variant_token = 'ug-Arab'
    )
    WHERE sm.variant_id IS NULL
    AND s.locale_id = (
        SELECT l.id 
        FROM locales l
        WHERE l.name = 'ug'
    );
  `)

  await db.runSql(`
    INSERT INTO sentence_metadata (sentence_id, variant_id, created_at)
    SELECT
      s.id,
      v.id,
      NOW()
    FROM
      sentences s
      JOIN locales l ON s.locale_id = l.id
      JOIN variants v ON v.variant_token = 'ug-Arab'
    WHERE
      l.name = 'ug'
      AND NOT EXISTS (
        SELECT 1 
        FROM sentence_metadata sm 
        WHERE sm.sentence_id = s.id
        AND sm.variant_id = v.id
      );
    `)
}

export const down = async function (): Promise<any> {
  return null
}
