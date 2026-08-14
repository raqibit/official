import { HeroSection } from '@/components/sections/HeroSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { StudioSection } from '@/components/sections/StudioSection'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { ContactSection } from '@/components/sections/ContactSection'

import { BookQuoteSection } from '@/components/sections/BookQuoteSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <StudioSection />
      <FeaturedProjects />
      <ContactSection />
      <BookQuoteSection />
    </>
  )
}
