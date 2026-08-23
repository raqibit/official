export type BookingStep = 'date' | 'time' | 'details' | 'confirm'

export function StepBar({ current }: { current: BookingStep }) {
  const steps: { id: BookingStep; label: string }[] = [
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { id: 'details', label: 'Details' },
    { id: 'confirm', label: 'Confirm' }
  ]

  const currentIndex = steps.findIndex(s => s.id === current)

  return (
    <div className="flex items-center justify-between w-full mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/[0.06] -z-10" />
      {steps.map((step, idx) => {
        const isActive = idx === currentIndex
        const isPast = idx < currentIndex
        return (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                isActive
                  ? 'bg-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.5)]'
                  : isPast
                  ? 'bg-white text-white'
                  : 'bg-[#111] border border-white/[0.2]'
              }`}
            />
            <span
              className={`text-[10px] uppercase font-mono tracking-widest ${
                isActive ? 'text-[#00e5ff]' : 'text-zinc-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
