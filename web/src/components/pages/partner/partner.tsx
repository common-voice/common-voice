import * as React from 'react'
import { Localized } from '@fluent/react'

import Page from '../../ui/page'

import PageHeading from '../../ui/page-heading'
import { LinkButton } from '../../ui/ui'
import { MailIcon } from '../../ui/icons'
import { COMMON_VOICE_EMAIL } from '../../../constants'
import { PartnerOptionSection } from './partner-option-section'
import { PARTNER_OPTIONS } from './partner-options'
import Subscribe from '../../email-subscribe-block/subscribe'
import { DonateBanner } from '../../donate-banner'

import { useDonateBanner } from '../../../hooks/store-hooks'

import './partner.css'

const Partner = () => {
  const donateBanner = useDonateBanner()

  return (
    <Page className="partner-main-container" dataTestId="partnerships-page">
      <section className="partnerships-section">
        <div className="partnerships-container">
          <div className="partnerships-header-text">
            <PageHeading>
              <Localized id="partnerships-header" />
            </PageHeading>
            <Localized id="partnerships-header-text">
              <p />
            </Localized>
            <LinkButton rounded blank href={`mailto:${COMMON_VOICE_EMAIL}`}>
              <MailIcon />
              <Localized id="partnerships-get-in-touch" />
            </LinkButton>
          </div>
          <div className="partnerships-header-image">
            <img
              src={require('./images/mozilla-common-voice_foundation-mars.png')}
              alt="robot"
            />
          </div>
        </div>
      </section>
      <section className="become-a-partner-section">
        <div className="become-a-partner-container">
          <Localized id="partnerships-become-a-partner">
            <h2 className="section-heading-text">
              Become a Common Voice Partner
            </h2>
          </Localized>
          <div className="become-a-partner-options">
            {PARTNER_OPTIONS.map(option => (
              <PartnerOptionSection
                option={option.id}
                elems={option.elems}
                key={option.id}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="our-partners-section">
        <div className="our-partners-container">
          <Localized id="partnerships-our-partners">
            <h2 className="section-heading-text">Our Partners</h2>
          </Localized>
          <div className="our-partners-images-container">
            <img
              src={require('./images/partners/ff-logo.jpg')}
              srcSet={`${require('./images/partners/ff-logo-small.jpg')} 370w, ${require('./images/partners/ff-logo.jpg')} 1111w`}
              sizes="(max-width: 600px) 370px, 1111px"
              alt="Fair Forward"
              width={350}
              height={135}
            />
            <img
              src={require('./images/partners/Bill_&_Melinda_Gates_Foundation_logo.jpg')}
              srcSet={`${require('./images/partners/Bill_&_Melinda_Gates_Foundation_logo-small.jpg')} 370w, ${require('./images/partners/Bill_&_Melinda_Gates_Foundation_logo.jpg')} 741w`}
              sizes="(max-width: 600px) 370px, 741px"
              alt="Bill and Melinda Gates Foundation"
              width={370}
              height={135}
            />
            <img
              src={require('./images/partners/giz-logo.jpg')}
              srcSet={`${require('./images/partners/giz-logo-small.jpg')} 366w, ${require('./images/partners/giz-logo.jpg')} 1096w`}
              sizes="(max-width: 600px) 366px, 1096px"
              alt="Deutsche Gesellschaft für Internationale Zusammenarbeit"
              width={370}
              height={135}
            />
            <img
              src={require('./images/partners/collectivat.jpg')}
              srcSet={`${require('./images/partners/collectivat-small.jpg')} 370w, ${require('./images/partners/collectivat.jpg')} 740w`}
              sizes="(max-width: 600px) 370px, 740px"
              alt="Collectivat"
              className="collectivat-logo"
            />
            <img
              src={require('./images/partners/Mak-Logo 1.jpg')}
              alt="Makerere"
              className="makerere-logo"
            />
            <img
              src={require('./images/partners/nvidia-logo-vert.jpg')}
              alt="Nvidia"
              className="nvidia-logo"
            />
          </div>
        </div>
      </section>
      <section className="donate-banner-section">
        <DonateBanner background={donateBanner.colour} />
      </section>
      <Subscribe light partnerships subscribeText="about-subscribe-text" />
    </Page>
  )
}

export default Partner
