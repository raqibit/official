import { HeroSection } from '@/components/sections/HeroSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { StudioSection } from '@/components/sections/StudioSection'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { ContactSection } from '@/components/sections/ContactSection'

import { BookQuoteSection } from '@/components/sections/BookQuoteSection'
import { getProjects } from '@/lib/mdx'

export default async function Home() {
  const allProjects = getProjects()
  const featuredProjects = allProjects.slice(0, 3)

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
