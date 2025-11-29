import * as React from 'react'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Spinner } from '../../ui/ui'

import DatasetIntro from './dataset-intro'
import DatasetCorpusDownload from './dataset-corpus-download'
import DatasetSegmentDownload from './dataset-segment-download'
import { DonateBanner } from '../../donate-banner'
import { useAPI } from '../../../hooks/store-hooks'
import StateTree from '../../../stores/tree'

import { useLocale } from '../../locale-helpers'
import DatasetDescription from './dataset-description'
import { Dataset } from 'common'

import './dataset-info.css'

interface PropsFromState {
  isSubscribedToMailingList: boolean
}

const DatasetInfo: React.FC<PropsFromState> = ({
  isSubscribedToMailingList,
}) => {
  const [isLoading, setIsLoading] = useState(true)

  const [languagesWithDatasets, setLanguagesWithDatasets] = useState([])
  const [currentDataset, setCurrentDataset] = useState<Dataset>()

  const api = useAPI()
  const [globalLocale] = useLocale()

  useEffect(() => {
    setIsLoading(true)

    // Use Promise.all to ensure loading state is properly managed
    Promise.all([
      api.getLanguagesWithDatasets().catch((err): string[] => {
        console.error('could not fetch languages with datasets', err)
        return [] // Return empty array on error
      }),
      api.getDatasets('complete').catch((err): Dataset[] => {
        console.error('could not fetch datasets', err)
        return [] // Return empty array on error
      }),
    ])
      .then(([languagesData, datasetsData]) => {
        setLanguagesWithDatasets(languagesData)
        setCurrentDataset(datasetsData[0])
      })
      .finally(() => {
        setIsLoading(false) // Always set loading to false
      })
  }, [])

  return (
    <div className="dataset-info">
      <div className="top">
        <DatasetIntro />
        {isLoading ? (
          <div className="dataset-corpus-download-placeholder">
            <Spinner isFloating={false} />
          </div>
        ) : (
          <DatasetCorpusDownload
            languagesWithDatasets={languagesWithDatasets}
            initialLanguage={
              languagesWithDatasets.includes(globalLocale) ? globalLocale : 'en'
            }
            isSubscribedToMailingList={isSubscribedToMailingList}
          />
        )}
      </div>

      {isLoading ? (
        <Spinner isFloating={false} />
      ) : (
        <DatasetDescription releaseData={currentDataset} />
      )}

      <div className="donate-banner-wrapper">
        <DonateBanner />
      </div>

      <DatasetSegmentDownload
        isSubscribedToMailingList={isSubscribedToMailingList}
      />
    </div>
  )
}

export default connect<PropsFromState>(({ user }: StateTree) => ({
  isSubscribedToMailingList: user.isSubscribedToMailingList,
}))(DatasetInfo)
