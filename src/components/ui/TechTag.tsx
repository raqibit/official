// ─────────────────────────────────────────────────────────────────────────────
// TechTag — reusable technology pill component
// ─────────────────────────────────────────────────────────────────────────────
// Renders a small bordered pill with the technology name, tinted to the
// project's accent colour. Used in FeaturedProjects, ProjectDetailOverlay,
// ProjectsClient, and SkillsSection.

type TechTagProps = {
  /** Display text (e.g. "React", "Next.js") */
  label: string
  /** Accent colour — used for text, border tint, and background tint */
  accentColor: string
  /** Optional size variant */
  size?: 'xs' | 'sm'
}

export function TechTag({ label, accentColor, size = 'xs' }: TechTagProps) {
  const sizeClasses = size === 'sm'
    ? 'text-xs px-3 py-1'
    : 'text-[10px] px-2 py-0.5'

  return (
    <span
      className={`${sizeClasses} border`}
      style={{
        fontFamily: 'var(--font-mono)',
        color: accentColor,
        borderColor: `${accentColor}30`,
        background: `${accentColor}0a`,
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </span>
  )
}
