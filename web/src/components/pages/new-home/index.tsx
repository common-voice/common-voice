import React from 'react'

import Page from '../../ui/page'
import { HeroSection } from './hero-section'
import { CommunitySection } from './community-section'

const Home = () => {
  return (
    <Page className="home">
      <HeroSection />
      <CommunitySection />
    </Page>
  )
}

export default Home
