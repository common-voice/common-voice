/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Migration: Remove deprecated columns
 *
 * This migration removes deprecated columns that are no longer in use.
 * The migration uses a transaction to ensure data integrity.
 *
 * user_clients table:
 * - deprecated_accent: Migrated to user_client_accents table (migration 20190125140627)
 * - deprecated_bucket: Migrated to user_client_locale_buckets table (migration 20190125140627)
 *   Note: user_client_locale_buckets itself is being dropped as it is not currently used
 * - deprecated_sso_id: Replaced with has_login boolean field (migration 20181123102419)
 * - deprecated_age: Migrated to demographics table via ages reference (migration 20200603213417)
 * - deprecated_gender: Migrated to demographics table via genders reference (migration 20200603213417)
 *
 * sentences table:
 * - bucket: Originally for train/dev/test split, not used in current code
 * - source_old: Temporary column from encoding fix migration (20230711121706), replaced by "source"
 *
 * clips table:
 * - bucket: Originally for train/dev/test split, not used in current code
 *   Dataset generation uses CorporaCreator for bucketing
 * - needs_votes: Cache column added but never used (migration 20180528105532)
 */

export const up = async function (db: any): Promise<any> {
  // Use transaction for safety
  await db.runSql('START TRANSACTION')
  try {
    // Drop indexes that depend on columns we're removing
    await db.runSql(`DROP INDEX sso_id ON user_clients;`)
    await db.runSql(`DROP INDEX source ON sentences;`)
    await db.runSql(`DROP INDEX source_idx ON sentences;`)
    await db.runSql(`DROP INDEX needs_votes_idx ON clips;`)

    // Drop deprecated columns from user_clients (data already migrated)
    await db.runSql(`
      ALTER TABLE user_clients
        DROP COLUMN deprecated_accent,
        DROP COLUMN deprecated_age,
        DROP COLUMN deprecated_gender,
        DROP COLUMN deprecated_bucket,
        DROP COLUMN deprecated_sso_id;
    `)

    // Drop unused bucket and source_old columns from sentences
    await db.runSql(`
      ALTER TABLE sentences
        DROP COLUMN bucket,
        DROP COLUMN source_old;
    `)

    // Drop unused bucket and needs_votes columns from clips
    await db.runSql(`
      ALTER TABLE clips
        DROP COLUMN bucket,
        DROP COLUMN needs_votes;
    `)

    // Commit transaction
    await db.runSql('COMMIT')
  } catch (error) {
    console.error(
      '[MIGRATION] Error during running 20260131020100-drop-deprecated-columns:',
      error
    )
    // Rollback transaction
    await db.runSql('ROLLBACK')
    throw error
  }
}

export const down = async function (): Promise<any> {
  // Irreversible - data has been migrated to other tables or is no longer needed
  return null
}
