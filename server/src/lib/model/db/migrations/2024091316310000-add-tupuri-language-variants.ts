export const up = async function (db: any): Promise<any> {
  const [tupuriLocale] = await db.runSql(
    `SELECT id FROM locales WHERE name = 'tui'`
  )

  await db.runSql(`
    INSERT INTO variants (locale_id, variant_name, variant_token)
    VALUES (${tupuriLocale.id}, 'Ɓaŋwere (Tupuri Bangwere)', 'tui-bangwere'),
           (${tupuriLocale.id}, 'Ɓaŋgɔ̀ (Tupuri Banggo)', 'tui-banggo')
    `)
}

export const down = async function (): Promise<any> {
  return null
}
