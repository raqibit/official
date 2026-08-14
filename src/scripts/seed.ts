import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'

async function main() {
  console.log('Seeding Database...')

  // Seed Projects
  const projectsPath = path.join(process.cwd(), 'src', 'data', 'projects.json')
  if (fs.existsSync(projectsPath)) {
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))
    for (const proj of projects) {
      await prisma.project.upsert({
        where: { id: proj.id },
        update: {},
        create: {
          id: proj.id,
          name: proj.name,
          tagline: proj.tagline,
          about: proj.about,
          videoUrl: proj.videoUrl || '',
          liveUrl: proj.liveUrl || '',
          githubUrl: proj.githubUrl || '',
          review: proj.review || '',
          price: proj.price || 0,
          accentColor: proj.accentColor,
          images: JSON.stringify(proj.images || []),
          techStack: JSON.stringify(proj.techStack || []),
        }
      })
    }
    console.log(`Seeded ${projects.length} projects.`)
  }

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
