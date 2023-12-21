import React, { useState } from 'react'
import { ChevronDown } from '../../ui/icons'

import './mobile-dataset-metadata-viewer.css'
import ExpandableInformation from '../../expandable-information/expandable-information'

export const MobileDatasetMetadataViewer = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="metadata-viewer-container hidden-lg-up">
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <p>Version</p>
        <p>Date</p>
      </div>
      <div className="md-metadata-info" onClick={() => setExpanded(!expanded)}>
        <p>EN Corpus 9.0</p>
        <p>2022-04-07</p>
        <ChevronDown className={expanded ? 'expanded' : ''} />
      </div>
      <div className={`expanded-box ${!expanded ? 'collapsed' : ''}`}>
        lflfl
      </div>
    </div>
  )
}
