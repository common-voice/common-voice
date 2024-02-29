export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    CREATE TABLE sentence_domains (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      domain VARCHAR(255) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE (domain)
    )
  `)

  await db.runSql(`
    INSERT INTO sentence_domains (domain)
    VALUES ('general'),
      ('agriculture'),
      ('automotive'),
      ('finance'),
      ('food_service_retail'),
      ('healthcare'),
      ('history_law_government'),
      ('media_entertainment'),
      ('nature_environment'),
      ('news_current_affairs'),
      ('technology_robotics'),
      ('language_fundamentals')
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    DROP TABLE sentence_domains
  `)

  return null
}
