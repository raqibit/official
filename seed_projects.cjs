const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const projects = [
  {
    name: 'Omnifood',
    tagline: 'An AI-driven healthy food subscription service tailored to personal tastes and nutritional needs.',
    about: 'A landing page and complete front-end for a fictional smart food subscription company. It features modern CSS layouts, responsive design, and CSS grid to create an appealing and user-friendly experience.',
    images: JSON.stringify(['/images/projects/omnifood.jpg']),
    liveUrl: 'https://omnifood.dev/',
    githubUrl: '',
    techStack: JSON.stringify(['HTML', 'CSS', 'JavaScript']),
    accentColor: '#e67e22',
  },
  {
    name: 'Mapty',
    tagline: 'Map your workouts and track your fitness journey with interactive mapping.',
    about: 'An object-oriented JavaScript application that uses the Geolocation API and Leaflet library to log workouts on a map. Data is persisted using local storage.',
    images: JSON.stringify(['/images/projects/mapty.jpg']),
    liveUrl: 'https://mapty.netlify.app/',
    githubUrl: '',
    techStack: JSON.stringify(['JavaScript', 'Leaflet.js', 'HTML5', 'CSS3']),
    accentColor: '#00c46a',
  },
  {
    name: 'Natours',
    tagline: 'Exciting tours for adventurous people — book your next outdoor experience.',
    about: 'A complex, modern web application featuring advanced CSS/Sass animations, a custom grid system, and an extensive Node.js/Express back-end with MongoDB for managing tours, users, and bookings.',
    images: JSON.stringify(['/images/projects/natours.jpg']),
    liveUrl: 'https://www.natours.dev/',
    githubUrl: '',
    techStack: JSON.stringify(['Node.js', 'Express', 'MongoDB', 'Sass', 'Pug']),
    accentColor: '#55c57a',
  },
  {
    name: 'Nexter',
    tagline: 'Your ultimate luxury home buying platform.',
    about: 'A stunning real estate landing page built entirely with CSS Grid. It showcases advanced grid techniques, overlapping elements, and fully responsive layouts without relying on external frameworks.',
    images: JSON.stringify(['/images/projects/nexter.jpg']),
    liveUrl: 'https://nexter.netlify.app/',
    githubUrl: '',
    techStack: JSON.stringify(['HTML5', 'CSS Grid', 'Sass']),
    accentColor: '#c69963',
  },
  {
    name: 'Forkify',
    tagline: 'Search over 1,000,000 recipes and create your personalized cookbook.',
    about: 'A model-view-controller (MVC) architecture application that interacts with a real-world API to fetch recipe data. Users can search for recipes, adjust servings, and bookmark favorites.',
    images: JSON.stringify(['/images/projects/forkify.jpg']),
    liveUrl: 'https://forkify-api.herokuapp.com/', // Changed from the API url to a generic view or keeping as provided
    githubUrl: '',
    techStack: JSON.stringify(['Vanilla JS', 'MVC', 'REST API', 'Webpack']),
    accentColor: '#f38e82',
  },
  {
    name: 'Bankist',
    tagline: 'When banking meets minimalist design and seamless user experience.',
    about: 'A minimalist banking application showcasing modern JavaScript features. It includes a marketing landing page with smooth scrolling, tabbed components, and slider features, plus a simulated banking dashboard for transferring funds and requesting loans.',
    images: JSON.stringify(['/images/projects/bankist.jpg']),
    liveUrl: 'https://bankist.netlify.app/',
    githubUrl: '',
    techStack: JSON.stringify(['JavaScript', 'DOM Manipulation', 'CSS3']),
    accentColor: '#5ec576',
  }
]

async function seed() {
  console.log('Seeding projects...')
  
  // First, clear out old placeholders if we want to replace them, but we'll just insert new ones
  for (const project of projects) {
    await prisma.project.create({
      data: project
    })
    console.log(`Created project: ${project.name}`)
  }
  
  console.log('Done.')
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
