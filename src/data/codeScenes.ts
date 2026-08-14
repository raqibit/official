// ── Code scenes for AnimatedCodeEditor & GlassTerminal ───────────────────────
// Each scene represents a tab/file shown in the animated editor widget.

export type Token = { text: string; color: string }

export type CodeScene = {
  label: string   // Tab label shown to the user
  file: string    // Fake file path shown in the title bar
  tokens: Token[] // Syntax-highlighted token stream
}

export const CODE_SCENES: CodeScene[] = [
  {
    label: 'API Route',
    file: 'api/projects/route.ts',
    tokens: [
      { text: 'import', color: 'text-[#c678dd]' }, { text: ' { NextResponse } ', color: 'text-gray-300' }, { text: 'from', color: 'text-[#c678dd]' }, { text: " 'next/server'\n", color: 'text-[#98c379]' },
      { text: 'import', color: 'text-[#c678dd]' }, { text: ' { prisma } ', color: 'text-gray-300' }, { text: 'from', color: 'text-[#c678dd]' }, { text: " '@/lib/prisma'\n\n", color: 'text-[#98c379]' },
      { text: 'export async function ', color: 'text-[#c678dd]' }, { text: 'GET', color: 'text-[#61afef]' }, { text: '() {\n', color: 'text-gray-300' },
      { text: '  const ', color: 'text-[#c678dd]' }, { text: 'projects ', color: 'text-[#e06c75]' }, { text: '= await ', color: 'text-[#56b6c2]' },
      { text: 'prisma', color: 'text-[#e5c07b]' }, { text: '.', color: 'text-gray-300' }, { text: 'project', color: 'text-[#61afef]' },
      { text: '.', color: 'text-gray-300' }, { text: 'findMany', color: 'text-[#61afef]' }, { text: '({\n', color: 'text-gray-300' },
      { text: '    where', color: 'text-[#d19a66]' }, { text: ': { deletedAt', color: 'text-gray-300' }, { text: ': ', color: 'text-gray-300' }, { text: 'null', color: 'text-[#d19a66]' }, { text: ' },\n', color: 'text-gray-300' },
      { text: '    orderBy', color: 'text-[#d19a66]' }, { text: ': { createdAt', color: 'text-gray-300' }, { text: ': ', color: 'text-gray-300' }, { text: "'asc'", color: 'text-[#98c379]' }, { text: ' }\n', color: 'text-gray-300' },
      { text: '  })\n', color: 'text-gray-300' },
      { text: '  return ', color: 'text-[#c678dd]' }, { text: 'NextResponse', color: 'text-[#e5c07b]' }, { text: '.', color: 'text-gray-300' },
      { text: 'json', color: 'text-[#61afef]' }, { text: '(projects)\n', color: 'text-gray-300' },
      { text: '}', color: 'text-gray-300' },
    ],
  },
  {
    label: 'Animation',
    file: 'components/HeroSection.tsx',
    tokens: [
      { text: 'import', color: 'text-[#c678dd]' }, { text: ' { motion } ', color: 'text-gray-300' }, { text: 'from', color: 'text-[#c678dd]' }, { text: " 'framer-motion'\n\n", color: 'text-[#98c379]' },
      { text: 'const ', color: 'text-[#c678dd]' }, { text: 'fadeUp', color: 'text-[#e06c75]' }, { text: ' = {\n', color: 'text-gray-300' },
      { text: '  hidden', color: 'text-[#d19a66]' }, { text: ': { opacity', color: 'text-gray-300' }, { text: ': ', color: 'text-gray-300' }, { text: '0', color: 'text-[#d19a66]' }, { text: ', y', color: 'text-gray-300' }, { text: ': ', color: 'text-gray-300' }, { text: '40 ', color: 'text-[#d19a66]' }, { text: '},\n', color: 'text-gray-300' },
      { text: '  show', color: 'text-[#d19a66]' }, { text: ': {\n', color: 'text-gray-300' },
      { text: '    opacity', color: 'text-[#d19a66]' }, { text: ': ', color: 'text-gray-300' }, { text: '1', color: 'text-[#d19a66]' }, { text: ', y', color: 'text-gray-300' }, { text: ': ', color: 'text-gray-300' }, { text: '0', color: 'text-[#d19a66]' }, { text: ',\n', color: 'text-gray-300' },
      { text: '    transition', color: 'text-[#d19a66]' }, { text: ': { duration', color: 'text-gray-300' }, { text: ': ', color: 'text-gray-300' }, { text: '0.8', color: 'text-[#d19a66]' }, { text: ' }\n', color: 'text-gray-300' },
      { text: '  }\n', color: 'text-gray-300' },
      { text: '}\n\n', color: 'text-gray-300' },
      { text: 'export function ', color: 'text-[#c678dd]' }, { text: 'HeroSection', color: 'text-[#61afef]' }, { text: '() {\n', color: 'text-gray-300' },
      { text: '  return ', color: 'text-[#c678dd]' }, { text: '(\n    <', color: 'text-gray-300' },
      { text: 'motion.div\n', color: 'text-[#e06c75]' },
      { text: '      variants', color: 'text-[#d19a66]' }, { text: '={fadeUp}\n', color: 'text-gray-300' },
      { text: '      animate', color: 'text-[#d19a66]' }, { text: '=', color: 'text-gray-300' }, { text: '"show"', color: 'text-[#98c379]' }, { text: '\n    />\n  )\n}', color: 'text-gray-300' },
    ],
  },
  {
    label: 'Prisma Schema',
    file: 'prisma/schema.prisma',
    tokens: [
      { text: 'model ', color: 'text-[#c678dd]' }, { text: 'Project', color: 'text-[#e5c07b]' }, { text: ' {\n', color: 'text-gray-300' },
      { text: '  id          ', color: 'text-[#e06c75]' }, { text: 'String   ', color: 'text-[#61afef]' }, { text: '@id', color: 'text-[#56b6c2]' }, { text: ' @default(', color: 'text-gray-300' }, { text: 'cuid', color: 'text-[#61afef]' }, { text: '())\n', color: 'text-gray-300' },
      { text: '  name        ', color: 'text-[#e06c75]' }, { text: 'String\n', color: 'text-[#61afef]' },
      { text: '  tagline     ', color: 'text-[#e06c75]' }, { text: 'String\n', color: 'text-[#61afef]' },
      { text: '  techStack   ', color: 'text-[#e06c75]' }, { text: 'String\n', color: 'text-[#61afef]' },
      { text: '  accentColor ', color: 'text-[#e06c75]' }, { text: 'String\n', color: 'text-[#61afef]' },
      { text: '  deletedAt   ', color: 'text-[#e06c75]' }, { text: 'DateTime', color: 'text-[#61afef]' }, { text: '?\n', color: 'text-[#56b6c2]' },
      { text: '  createdAt   ', color: 'text-[#e06c75]' }, { text: 'DateTime ', color: 'text-[#61afef]' }, { text: '@default(', color: 'text-gray-300' }, { text: 'now', color: 'text-[#61afef]' }, { text: '())\n', color: 'text-gray-300' },
      { text: '  updatedAt   ', color: 'text-[#e06c75]' }, { text: 'DateTime ', color: 'text-[#61afef]' }, { text: '@updatedAt\n', color: 'text-[#56b6c2]' },
      { text: '}', color: 'text-gray-300' },
    ],
  },
  {
    label: 'React Hook',
    file: 'hooks/useScrollReveal.ts',
    tokens: [
      { text: 'import', color: 'text-[#c678dd]' }, { text: ' { useEffect, useRef } ', color: 'text-gray-300' }, { text: 'from', color: 'text-[#c678dd]' }, { text: " 'react'\n\n", color: 'text-[#98c379]' },
      { text: 'export function ', color: 'text-[#c678dd]' }, { text: 'useScrollReveal', color: 'text-[#61afef]' }, { text: '<', color: 'text-gray-300' }, { text: 'T extends ', color: 'text-[#e5c07b]' }, { text: 'Element', color: 'text-[#61afef]' }, { text: '>() {\n', color: 'text-gray-300' },
      { text: '  const ', color: 'text-[#c678dd]' }, { text: 'ref ', color: 'text-[#e06c75]' }, { text: '= ', color: 'text-[#56b6c2]' }, { text: 'useRef', color: 'text-[#61afef]' }, { text: '<T | null>(', color: 'text-gray-300' }, { text: 'null', color: 'text-[#d19a66]' }, { text: ')\n\n', color: 'text-gray-300' },
      { text: '  useEffect', color: 'text-[#61afef]' }, { text: '(() => {\n', color: 'text-gray-300' },
      { text: '    const ', color: 'text-[#c678dd]' }, { text: 'observer ', color: 'text-[#e06c75]' }, { text: '= new ', color: 'text-[#56b6c2]' }, { text: 'IntersectionObserver', color: 'text-[#e5c07b]' }, { text: '(\n', color: 'text-gray-300' },
      { text: '      ([entry]) => ', color: 'text-gray-300' }, { text: 'entry.isIntersecting\n', color: 'text-[#d19a66]' },
      { text: '    )\n', color: 'text-gray-300' },
      { text: '    if ', color: 'text-[#c678dd]' }, { text: '(ref.current) observer.', color: 'text-gray-300' }, { text: 'observe', color: 'text-[#61afef]' }, { text: '(ref.current)\n', color: 'text-gray-300' },
      { text: '    return ', color: 'text-[#c678dd]' }, { text: '() => observer.', color: 'text-gray-300' }, { text: 'disconnect', color: 'text-[#61afef]' }, { text: '()\n', color: 'text-gray-300' },
      { text: '  }, [])\n\n', color: 'text-gray-300' },
      { text: '  return ', color: 'text-[#c678dd]' }, { text: '{ ref }\n', color: 'text-gray-300' },
      { text: '}', color: 'text-gray-300' },
    ],
  },
]
