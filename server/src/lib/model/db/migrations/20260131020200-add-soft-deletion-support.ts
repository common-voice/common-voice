/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Migration: Add soft deletion support to core tables
 *
 * This is useful for GDPR compliance, content moderation, and data cleanup scenarios.
 * This migration adds soft deletion schema support to user_clients, clips, and sentences tables.
 * Soft deletion allows marking records as deleted without physically removing them from the database.
 * This enables recovery, auditing, and delayed permanent deletion.
 * Actual deletion will be handled in separate migrations or via scheduled jobs, with grace period or immediate options.
 *
 */

export const up = async function (db: any): Promise<any> {
  console.log('[MIGRATION] Adding soft deletion support to core tables...')

  // USER_CLIENTS
  await db.runSql(`
    ALTER TABLE user_clients
      ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0,
      ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
  `)

  // CLIPS
  await db.runSql(`
    ALTER TABLE clips
      ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0,
      ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
  `)

  // SENTENCES
  await db.runSql(`
    ALTER TABLE sentences
      ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0,
      ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
  `)

  // ADD INDEXES FOR SOFT DELETION
  console.log('[MIGRATION] Adding indexes to support soft deletion queries...')

  // user_clients indexes
  await db.runSql(`
    ALTER TABLE user_clients
      ADD INDEX idx_is_deleted (is_deleted),
      ADD INDEX idx_deleted_at (deleted_at);
  `)

  // clips indexes - composite for common query patterns
  await db.runSql(`
    ALTER TABLE clips
      ADD INDEX idx_is_deleted (is_deleted),
      ADD INDEX idx_deleted_at (deleted_at),
      ADD INDEX idx_deleted_locale (is_deleted, locale_id);
  `)

  // sentences indexes - composite for common query patterns
  await db.runSql(`
    ALTER TABLE sentences
      ADD INDEX idx_is_deleted (is_deleted),
      ADD INDEX idx_deleted_at (deleted_at),
      ADD INDEX idx_deleted_locale (is_deleted, locale_id);
  `)
}

export const down = async function (db: any): Promise<any> {
  console.log('[MIGRATION] Removing soft deletion support...')

  // Drop indexes first
  await db.runSql(`
    ALTER TABLE user_clients
      DROP INDEX idx_is_deleted,
      DROP INDEX idx_deleted_at;
      
    ALTER TABLE clips
      DROP INDEX idx_is_deleted,
      DROP INDEX idx_deleted_at,
      DROP INDEX idx_deleted_locale;
      
    ALTER TABLE sentences
      DROP INDEX idx_is_deleted,
      DROP INDEX idx_deleted_at,
      DROP INDEX idx_deleted_locale;
  `)

  // Drop columns
  await db.runSql(`
    ALTER TABLE user_clients
      DROP COLUMN is_deleted,
      DROP COLUMN deleted_at;
      
    ALTER TABLE clips
      DROP COLUMN is_deleted,
      DROP COLUMN deleted_at;
      
    ALTER TABLE sentences
      DROP COLUMN is_deleted,
      DROP COLUMN deleted_at;
  `)

  console.log('[MIGRATION] Soft deletion support removed.')
}
