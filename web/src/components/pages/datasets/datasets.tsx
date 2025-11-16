import * as React from 'react'

import DatasetInfo from './dataset-info'
import Resources from './resources'
import Page from '../../ui/page'
import { Spinner } from '../../ui/ui'
import {
  useFeature,
  useFeatureContextLoaded,
} from '../../../contexts/feature-context'
import URLS from '../../../urls'

const Datasets = () => {
  const hasOldDatasetsFeature = useFeature('datasets-old')
  const featureContextLoaded = useFeatureContextLoaded()

  // Show spinner while feature context is loading
  if (!featureContextLoaded) {
    return <Spinner />
  }

  // Redirect to MDC datasets if feature flag is not present
  if (!hasOldDatasetsFeature) {
    window.location.href = URLS.MDC_DATASETS
    return <Spinner />
  }

  return (
    <Page className="datasets-content">
      <DatasetInfo />
      <Resources />
    </Page>
  )
}

export default Datasets
