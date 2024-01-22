import * as React from 'react'
import { Localized } from '@fluent/react'
import { useDispatch } from 'react-redux'

import { PrimaryButton } from '../../../../../primary-buttons/primary-buttons'
import { EditIcon } from '../../../../../ui/icons'
import { LocaleNavLink } from '../../../../../locale-helpers'
import URLS from '../../../../../../urls'
import { Sentences } from '../../../../../../stores/sentences'

const BulkSubmissionSuccess = () => {
  const dispatch = useDispatch()

  const handleUploadMoreBtnClick = () => {
    dispatch(Sentences.actions.setBulkUploadStatus('off'))
  }

  return (
    <div
      className="bulk-submission-success"
      data-testid="bulk-submission-success">
      <img
        src={require('../../../../../../../img/happy-mars@2x.png')}
        alt="Happy Mars"
        width={175}
        height={175}
        data-testid="happy-mars"
      />
      <Localized id="bulk-submission-success-header">
        <h1 className="header-text" />
      </Localized>
      <Localized id="bulk-submission-success-subheader">
        <h3 className="subheader-text" />
      </Localized>

      <PrimaryButton
        className="upload-more-btn"
        onClick={handleUploadMoreBtnClick}>
        <EditIcon />
        <Localized id="upload-more-btn-text">
          <span />
        </Localized>
      </PrimaryButton>

      <LocaleNavLink to={URLS.PROFILE} className="edit-profile-nav-link">
        <Localized id="edit-profile" />
      </LocaleNavLink>
    </div>
  )
}

export default BulkSubmissionSuccess
