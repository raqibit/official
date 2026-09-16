'use client'

/**
 * MiniCalendar
 * ─────────────────────────────────────────────────────────────────────────────
 * Compact date picker used in the booking flow (BookQuoteSection).
 * Features:
 *  - Disables past dates and Sundays
 *  - Navigates by month (cannot go before current month)
 *  - Highlights the selected date with a cyan glow
 *  - Properly handles timezone-safe date comparisons
 *  - Keyboard accessible with aria labels
 */

import { useState, useMemo, useCallback } from 'react'
import { ChevronIcon } from '@/components/icons'

type MiniCalendarProps = {
  selected: Date | null
  onSelect: (d: Date) => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function MiniCalendar({ selected, onSelect }: MiniCalendarProps) {
  // Initialize calendar view to the selected date's month, or the current month
  const [currentMonth, setCurrentMonth] = useState(() => selected || new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  /** Today at midnight — used for past-date comparison */
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  /** Number of days in the active month */
  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month],
  )

  /** Day-of-week index (0=Sun) the month starts on — determines empty grid slots */
  const firstDayOfMonth = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month],
  )

  const handlePrevMonth = useCallback(() => {
    if (!isCurrentMonth) {
      setCurrentMonth(new Date(year, month - 1, 1))
    }
  }, [isCurrentMonth, year, month])

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }, [year, month])

  return (
    <div
      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4"
      role="application"
      aria-label="Date picker"
    >
      {/* Header: month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          disabled={isCurrentMonth}
          aria-label="Previous month"
          className={`p-2 rounded-lg transition-colors ${
            isCurrentMonth
              ? 'text-zinc-700 cursor-not-allowed'
              : 'hover:bg-white/[0.05] text-zinc-400'
          }`}
        >
          <ChevronIcon direction="left" className="w-4 h-4" />
        </button>
        <span className="text-white font-mono text-sm tracking-widest uppercase">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={handleNextMonth}
          aria-label="Next month"
          className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-zinc-400"
        >
          <ChevronIcon direction="right" className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 gap-1" role="row">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-mono text-zinc-500 py-2"
            role="columnheader"
            aria-label={d}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1" role="grid">
        {/* Empty leading slots */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" role="gridcell" />
        ))}

        {/* Day buttons */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1
          const date = new Date(year, month, dayNum)
          date.setHours(0, 0, 0, 0)

          const isSelected = selected?.getTime() === date.getTime()
          const isPast = date.getTime() < today.getTime()
          const isSunday = date.getDay() === 0
          const isDisabled = isPast || isSunday

          return (
            <button
              key={dayNum}
              role="gridcell"
              disabled={isDisabled}
              onClick={() => onSelect(date)}
              aria-label={`${MONTH_NAMES[month]} ${dayNum}, ${year}${isSunday ? ' (unavailable)' : ''}${isPast ? ' (past)' : ''}`}
              aria-selected={isSelected}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-xs font-mono transition-all
                ${isSelected
                  ? 'bg-[#00e5ff] text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : isDisabled
                    ? 'text-zinc-700 cursor-not-allowed'
                    : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                }
              `}
            >
              {dayNum}
            </button>
          )
        })}
      </div>
    </div>
  )
}
