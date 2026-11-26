import { HeroSection } from '@/components/sections/HeroSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { StudioSection } from '@/components/sections/StudioSection'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { ContactSection } from '@/components/sections/ContactSection'

import { BookQuoteSection } from '@/components/sections/BookQuoteSection'
import { getFeaturedPortfolioProjects } from '@/lib/projects'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredProjects = await getFeaturedPortfolioProjects(3)

  return (
    <>
      <HeroSection />
      <SkillsSection />
      <StudioSection />
      <FeaturedProjects projects={featuredProjects} />
      <ContactSection />
      <BookQuoteSection />
    </>
  )
}
