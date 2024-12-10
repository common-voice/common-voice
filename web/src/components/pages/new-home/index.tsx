import React from 'react'

import { HeroSection } from './hero-section'
import { ActionItemsSection } from './action-items-section'
import { CommunitySection } from './community-section'
import { FeaturedSection } from './featured-section'
import { DevelopersSection } from './developers-section'
import { GetInvolvedSection } from './get-involved'
import { PartnerSection } from './partner-section'

import Page from '../../ui/page'

import { useScrollToSection } from '../../../hooks/use-scroll-to-section'

const Home = () => {
  useScrollToSection()

  return (
    <Page className="home">
      <HeroSection />
      <ActionItemsSection />
      <CommunitySection />
      <FeaturedSection />
      <DevelopersSection />
      <GetInvolvedSection />
      <PartnerSection />
    </Page>
  )
}

export default Home
