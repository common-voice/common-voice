import { TextDirection } from 'common'
import { getMySQLInstance } from './mysql'
import { log } from 'console'

// literal representation of languages in database (locales table)
// LTR = left-to-right, RTL = right-to-left, TTB = top-to-bottom, BTT = bottom-to-top
export interface ILanguageSchema {
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

  save(language: ILanguageSchema): ILanguageSchema {
    return language
  }
  /**
   *
   * @param language language data to be saved to db, must include valid id
   * @returns
   */
  update(language: ILanguageSchema) {
    const { id } = language //get language id

    const updatableLanguageData = Object.entries(language).filter(
      values => values[0] !== 'id'
    ) //filter out id so we can save whole object (i.e. not updating id)
    const columns = updatableLanguageData.filter(column => column[0] !== 'id')
    const parameterizeColumns = columns.map(column => `${column[0]} = ?`)
    const stringifiedParameterizedColumns = parameterizeColumns.join(', ')
    const languageColumnValues = [Object.values(updatableLanguageData), id]
    const query = `
      UPDATE ${this.TABLE_NAME} SET
      ${stringifiedParameterizedColumns}
      WHERE id = ?
    `

    log(query)
    return this.mysql.query(query, languageColumnValues)
  }

  //   function findById(id: number): Language {}

  //   function findAll(): Language {}

  //   function remove(language: Language): boolean {}
}

export default new LanguageRepository()
