import { useState } from 'react'

import {
  useAction,
  useLocalStorageState,
} from '../../../../../../hooks/store-hooks'
import { User } from '../../../../../../stores/user'
import { UserLanguage } from 'common'
import {
  FirstPostSubmissionCtaProps,
  USER_LANGUAGES,
} from '../firstPostSubmissionCTA'
import {
  AccentsAll,
  VariantsAll,
} from '../../../../profile/info/languages/languages'

export const useFirstPostSubmissionCTA = ({
  locale,
  onReset,
  addNotification,
  successUploadMessage,
  errorUploadMessage,
}: FirstPostSubmissionCtaProps) => {
  const saveAnonymousAccount = useAction(
    User.actions.saveAnonymousAccountLanguages
  )
  const [areLanguagesLoading, setAreLanguagesLoading] = useState(true)

  const [userLanguages, setUserLanguages] = useLocalStorageState<
    UserLanguage[]
  >([{ locale, accents: [] }], USER_LANGUAGES)

  const [accentsAll, setAccentsAll] = useState<AccentsAll>({})
  const [variantsAll, setVariantsAll] = useState<VariantsAll>({})
  const [gender, setGender] = useState('')

  const handleAddInformationClick = async () => {
    const data = {
      languages: userLanguages,
      gender,
    }

    try {
      await saveAnonymousAccount(data)
      addNotification(successUploadMessage, 'success')
    } catch {
      addNotification(errorUploadMessage, 'error')
    }

    onReset()
  }

  const handleSelectChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(evt.target.value)
  }

  const isAddInformationButtonDisabled =
    userLanguages[0].accents.length === 0 &&
    !userLanguages[0].variant &&
    gender.length === 0

  const isVariantInputVisible = Boolean(variantsAll[locale])

  return {
    gender,
    userLanguages,
    areLanguagesLoading,
    setAreLanguagesLoading,
    accentsAll,
    setAccentsAll,
    variantsAll,
    setVariantsAll,
    setUserLanguages,
    handleAddInformationClick,
    handleSelectChange,
    isAddInformationButtonDisabled,
    isVariantInputVisible,
  }
}
