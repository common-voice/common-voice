import React from 'react'

import Page from '../../ui/page'
import { HeroSection } from './hero-section'
import { ActionItemsSection } from './action-items-section'

const Home = () => {
  return (
    <Page className="home">
      <HeroSection />
      <ActionItemsSection />
    </Page>
  )
}

export default Home
