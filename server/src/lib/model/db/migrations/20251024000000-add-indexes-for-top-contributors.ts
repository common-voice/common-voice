/* eslint-disable @typescript-eslint/no-explicit-any */
//
// Migration to add the critical composite indexes to speed up top contributor tables on Dashboard stats
//
export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    -- Critical: Filter visible users first (currently 3.8M -> 51k)
    ALTER TABLE user_clients ADD INDEX idx_visible_client (visible, client_id);
    
    -- Critical: Count clips per user with locale support
    ALTER TABLE clips ADD INDEX idx_client_id_locale (client_id, locale_id);
  `)
}

export const down = async function (db: any): Promise<any> {
  return db.runSql(`
    ALTER TABLE user_clients DROP INDEX idx_visible;
    ALTER TABLE clips DROP INDEX idx_client_id_locale;
  `)
}
