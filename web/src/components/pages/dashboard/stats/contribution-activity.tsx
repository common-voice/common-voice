import * as React from 'react'
import { useEffect, useState } from 'react'

import { isProduction } from '../../../../utility'
import { BarPlot } from '../../../plot/plot'
import { useAPI } from '../../../../hooks/store-hooks'

interface Props {
  locale: string
  from: 'you' | 'everyone'
}

const ContributionActivity = ({ from, locale }: Props) => {
  const api = useAPI()
  const [barPlotData, setBarPlotData] = useState([])

  useEffect(() => {
    let isMounted = true

    api
      .fetchContributionActivity(from, locale)
      .then(data => {
        if (isMounted) {
          setBarPlotData(data)
        }
      })
      .catch(err => {
        if (!isProduction()) {
          console.warn('Failed to fetch contribution activity:', err)
        }
      })

    return () => {
      isMounted = false
    }
  }, [from, locale, api])

  return <BarPlot data={barPlotData} />
}

export default ContributionActivity
