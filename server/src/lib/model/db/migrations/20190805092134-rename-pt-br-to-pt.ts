export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      # We can ignore failing updates for portuguese as it doesn't have related
      # rows yet anyway 
      UPDATE IGNORE locales SET name = 'pt' WHERE name = 'pt-BR';
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
