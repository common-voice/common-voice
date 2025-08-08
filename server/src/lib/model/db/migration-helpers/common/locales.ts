export const findLocaleIdFromLocaleCode = async (
  db: any,
  locale: string
): Promise<number | null> => {
  const [result] = await db.runSql(`SELECT id FROM locales WHERE name = ?`, [
    locale,
  ])
  return result?.id ? result.id : null
}
