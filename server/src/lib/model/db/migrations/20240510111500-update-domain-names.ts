export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE domains SET domain='agriculture_food'
    WHERE domain = 'agriculture'
  `)
  await db.runSql(`
    UPDATE domains SET domain='automotive_transport'
    WHERE domain = 'automotive'
  `)
  await db.runSql(`
    UPDATE domains SET domain='service_retail'
    WHERE domain = 'food_service_retail'
  `)
}

export const down = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE domains SET domain= 'agriculture'
    WHERE domain = 'agriculture_food'
  `)
  await db.runSql(`
    UPDATE domains SET domain='automotive'
    WHERE domain = 'automotive_transport'
  `)
  await db.runSql(`
    UPDATE domains SET domain='food_service_retail'
    WHERE domain = 'service_retail'
  `)
}
