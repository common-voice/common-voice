export const up = async function (db: any): Promise<any> {
  return db.runSql(
    `
    INSERT INTO taxonomies (tax_name, type)
      VALUES ('Content', 'both');

    INSERT INTO taxonomy_terms (taxonomy_id, term_name, user_selectable)
      VALUES ((SELECT id FROM taxonomies WHERE tax_name = 'Content'), 'Benchmark', TRUE);
    `
  );
};

export const down = function (): Promise<any> {
  return null;
};
