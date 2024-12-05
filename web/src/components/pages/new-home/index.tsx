import React from 'react'

import { HeroSection } from './hero-section'
import { ActionItemsSection } from './action-items-section'
import { CommunitySection } from './community-section'
import { FeaturedSection } from './featured-section'
import { DevelopersSection } from './developers-section'

import Page from '../../ui/page'

const Home = () => {
  return (
    <Page className="home">
      <HeroSection />
      <ActionItemsSection />
      <CommunitySection />
      <FeaturedSection />
      <DevelopersSection />
    </Page>
  )
}

export default Home
