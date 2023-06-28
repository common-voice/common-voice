import { TextDirection } from 'common'
import { getMySQLInstance } from './mysql'

// literal representation of languages in database (locales table)
// LTR = left-to-right, RTL = right-to-left, TTB = top-to-bottom, BTT = bottom-to-top
export interface LanguageSchema {
  id: number
  name: string
  target_sentence_count: number
  native_name: string
  is_contributable: boolean
  is_translated: boolean
  text_direction: TextDirection
}

class LanguageRepository {
  TABLE_NAME = 'locales'
  mysql = getMySQLInstance()

  save(language: LanguageSchema): LanguageSchema {
    return language
  }

  async update(language: LanguageSchema): Promise<boolean> {
    const { id } = language //get language id

    const updatableLanguageData = Object.entries(language).filter(
      values => values[0] !== 'id'
    ) //filter out id so we can save whole object (i.e. not updating id)

    const columns = Object.keys(updatableLanguageData).filter(
      column => column !== 'id'
    )

    const parameterizeColumns = columns.map(column => `${column} = ?`)
    const stringifiedParameterizedColumns = parameterizeColumns.join(', ')
    const languageColumnValues = [Object.values(updatableLanguageData), id]

    const query = `
      UPDATE ${this.TABLE_NAME} SET
      ${stringifiedParameterizedColumns}
      WHERE id = ?
    `
    try {
      await this.mysql.query(query, languageColumnValues)
      return true
    } catch (error) {
      return false
    }
  }

  //   function findById(id: number): Language {}

  //   function findAll(): Language {}

  //   function remove(language: Language): boolean {}
}

export default new LanguageRepository()
