import { useState } from 'react'

export function MiniCalendar({ selected, onSelect }: { selected: Date | null, onSelect: (d: Date) => void }) {
  // Initialize calendar view to the selected date's month, or the current month
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const handlePrevMonth = () => {
    if (!isCurrentMonth) {
      setCurrentMonth(new Date(year, month - 1, 1))
    }
  }
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevMonth} 
          disabled={isCurrentMonth}
          className={`p-2 rounded-lg transition-colors ${
            isCurrentMonth ? 'text-zinc-700 cursor-not-allowed' : 'hover:bg-white/[0.05] text-zinc-400'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-white font-mono text-sm tracking-widest uppercase">
          {monthNames[month]} {year}
        </span>
        <button onClick={handleNextMonth} className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-zinc-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(d => (
          <div key={d} className="text-center text-[10px] font-mono text-zinc-500 py-2">
            {d}
          </div>
        ))}
        
        {/* Empty slots */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1)
          date.setHours(0, 0, 0, 0)
          const isSelected = selected?.getTime() === date.getTime()
          const isPast = date.getTime() < today.getTime()
          const isSunday = date.getDay() === 0

          return (
            <button
              key={i}
              disabled={isPast || isSunday}
              onClick={() => onSelect(date)}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-xs font-mono transition-all
                ${isSelected 
                  ? 'bg-[#00e5ff] text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                  : isPast || isSunday
                    ? 'text-zinc-700 cursor-not-allowed'
                    : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                }
              `}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
