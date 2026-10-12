/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Migration: Remove deprecated tables
 *
 * This migration removes deprecated tables that are no longer in use:
 *
 * 1. deprecated_users table
 *    - Renamed from 'users' in migration 20190125140627
 *    - Fully replaced by user_clients table
 *    - No code references found in backend or bundler
 *
 * 2. user_client_locale_buckets table
 *    - Created in migration 20180503112435 for train/dev/test bucket assignments per locale
 *    - Intended to replace deprecated_bucket column in user_clients
 *    - currently not used in any backend queries, API endpoints, or bundler
 *    - Only referenced in old migrations for schema changes
 *    - The bucket functionality was superseded by CorporaCreator
 */

export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    -- Drop the deprecated_users table
    DROP TABLE IF EXISTS deprecated_users;
    
    -- Drop the user_client_locale_buckets table
    DROP TABLE IF EXISTS user_client_locale_buckets;

  `)
}

export const down = async function (): Promise<any> {
  // Irreversible - tables are not in use and data is not needed
  return null
}
