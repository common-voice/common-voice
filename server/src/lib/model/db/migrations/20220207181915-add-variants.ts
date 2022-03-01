export const up = async function (db: any): Promise<any> {
  await db.runSql(
    `
    CREATE TABLE variants (
        id int(10) unsigned AUTO_INCREMENT NOT NULL,
        locale_id int(11) NOT NULL,
        variant_name varchar(255) CHARACTER SET utf8mb4 NOT NULL,
        variant_token varchar(255) CHARACTER SET utf8mb4 NULL,
        type varchar(255) CHARACTER SET utf8mb4 NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY variant_key (locale_id,variant_name),
        CONSTRAINT variants_ibfk_1 FOREIGN KEY (locale_id) REFERENCES locales (id)
    )
    `
  );
  await db.runSql(
    `
    CREATE TABLE user_client_variants (
        id bigint(20) unsigned AUTO_INCREMENT NOT NULL,
        client_id char(36) NOT NULL,
        locale_id INT(11) NOT NULL,
        variant_id int(10) unsigned DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY client_locale (client_id, locale_id),
        KEY client_id (client_id),
        KEY variant_id (variant_id),
        CONSTRAINT user_client_variants_ibfk_1 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) ON DELETE CASCADE,
        CONSTRAINT user_client_variants_ibfk_2 FOREIGN KEY (variant_id) REFERENCES variants (id) ON DELETE CASCADE,
        CONSTRAINT variants_ibfk_4 FOREIGN KEY (locale_id) REFERENCES locales (id)
    )
    `
  );
};

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    DROP TABLE user_client_variants;
    DROP TABLE variants;
  `);
};
