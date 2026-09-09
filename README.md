# Raqīb Ismāʿīl | Software Engineer

A high-performance, pixel-perfect personal portfolio and studio platform showcasing advanced software engineering, UI/UX architecture, and microsoldering capabilities. Built with modern web technologies, prioritizing cinematic aesthetics and frictionless user experiences.

## Architecture & Tech Stack

This project is architected as a highly optimized static application, deliberately avoiding heavy backend dependencies for maximum global edge delivery speed.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom design system & typography)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) (Physics-based interactions, layout transitions)
- **Data Management**: Static JSON/TS data structures for uncompromised load times.
- **Integrations**: Resend (Transactional Email), Google Calendar API (Booking).

## System Design

The codebase strictly adheres to a decoupled, scalable component architecture:
- `src/app/` - File-system based routing and global layout definitions.
- `src/components/ui/` - Atomic, reusable interface components (e.g., Modals, Cursors).
- `src/components/sections/` - Macro-level page compositions (e.g., HeroSection, FeaturedProjects).
- `src/components/overlays/` - Complex, state-driven interactive overlays (e.g., ProjectDetailOverlay).
- `src/data/` - Single source of truth for static content (Projects, Disciplines, Work History).

## Getting Started

### Prerequisites
- Node.js (v18.17.0 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rq-ismail/prime.git
   cd prime
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy the example environment file and populate the necessary keys (for contact forms and booking functionality).
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000).

## Build & Deployment

Optimized for Vercel deployment with edge caching.
```bash
npm run build
npm run start
```

## License

Personal Project. All rights reserved by Raqīb Ismāʿīl.
