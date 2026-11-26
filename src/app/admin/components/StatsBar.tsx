type Stats = {
  total: number
  published: number
  featured: number
  withAI: number
}

export default function StatsBar({ stats }: { stats: Stats }) {
  const items = [
    { label: 'Total Repos', value: stats.total },
    { label: 'Published', value: stats.published },
    { label: 'Featured', value: stats.featured },
    { label: 'AI Described', value: stats.withAI },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
        >
          <p className="text-2xl font-bold text-white">{item.value}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
