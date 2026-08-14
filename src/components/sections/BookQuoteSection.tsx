'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NewsletterSection } from './NewsletterSection'

// ── Types ─────────────────────────────────────────────────────────────────────
type BookingStep = 'date' | 'time' | 'details' | 'confirm'

const PROJECT_TYPES = [
  'Web Application',
  'Mobile App',
  'UI / Design System',
  'Microsoldering Repair',
  'Data Recovery',
  'Consultation',
  'Other',
]

const TIME_SLOTS = [
  { id: 'am', label: '9:00 AM', sub: 'Morning' },
  { id: 'noon', label: '1:00 PM', sub: 'Afternoon' },
  { id: 'eve', label: '5:00 PM', sub: 'Evening' },
]

// Days of week that are available (Mon–Sat, not Sun)
const BLOCKED_DAYS = [0] // Sunday

// ── Calendar ──────────────────────────────────────────────────────────────────
function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: Date | null
  onSelect: (d: Date) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthName = viewDate.toLocaleString('default', { month: 'long' })

  const cells = useMemo(() => {
    const arr: (Date | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(new Date(year, month, d))
    }
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [year, month, firstDay, daysInMonth])

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const isDisabled = (d: Date) =>
    d < today || BLOCKED_DAYS.includes(d.getDay())

  const isSelected = (d: Date) =>
    selected?.toDateString() === d.toDateString()

  const isToday = (d: Date) => d.toDateString() === today.toDateString()

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-mono text-xs tracking-widest text-white uppercase">
          {monthName} {year}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center font-mono text-[10px] text-zinc-600 py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const disabled = isDisabled(d)
          const sel = isSelected(d)
          const tod = isToday(d)
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => !disabled && onSelect(d)}
              className={`
                aspect-square w-full flex items-center justify-center rounded-lg font-mono text-xs transition-all
                ${disabled ? 'text-zinc-800 cursor-not-allowed' : 'cursor-pointer hover:bg-white/[0.07]'}
                ${sel ? 'bg-[#00e5ff] text-black font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]' : ''}
                ${tod && !sel ? 'text-[#00e5ff] border border-[#00e5ff]/30' : ''}
                ${!disabled && !sel && !tod ? 'text-zinc-400' : ''}
              `}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Glass wrapper ─────────────────────────────────────────────────────────────
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)' }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent" />
      {children}
    </div>
  )
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ current }: { current: BookingStep }) {
  const steps: { id: BookingStep; label: string }[] = [
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { id: 'details', label: 'Details' },
    { id: 'confirm', label: 'Confirm' },
  ]
  const idx = steps.findIndex(s => s.id === current)

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-0 flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[10px] transition-all
                ${i < idx ? 'bg-[#00e5ff] border-[#00e5ff] text-black' : ''}
                ${i === idx ? 'border-[#00e5ff] text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.3)]' : ''}
                ${i > idx ? 'border-white/10 text-zinc-700' : ''}
              `}
            >
              {i < idx ? '✓' : i + 1}
            </div>
            <span className={`font-mono text-[9px] tracking-wider ${i === idx ? 'text-[#00e5ff]' : 'text-zinc-600'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-1 -mt-4 transition-colors ${i < idx ? 'bg-[#00e5ff]/40' : 'bg-white/[0.06]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Input component ───────────────────────────────────────────────────────────
function GlassInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5">{label}{required && <span className="text-[#00e5ff] ml-0.5">*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/[0.03] border border-white/[0.08] text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/10 transition-all placeholder-zinc-700 font-mono"
      />
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export function BookQuoteSection() {
  const [step, setStep] = useState<BookingStep>('date')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          date: selectedDate?.toISOString().split('T')[0],
          timeSlot: selectedSlot,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('success')
    } catch (e: unknown) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Submission failed')
    }
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  if (status === 'success') {
    return (
      <section className="py-28 sm:py-36 relative overflow-hidden bg-[#080808]" id="book">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] bg-[#00e5ff] opacity-[0.04] rounded-full blur-[120px]" />
        </div>
        <div className="max-w-lg mx-auto px-6 text-center">
          <GlassCard className="p-12">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full border border-[#00e5ff]/30 bg-[#00e5ff]/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                <svg className="w-8 h-8 text-[#00e5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Session Booked!</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Your quote session is confirmed for <span className="text-[#00e5ff]">{selectedDate && formatDate(selectedDate)}</span> at <span className="text-[#00e5ff]">{selectedSlot}</span>.
                I&apos;ll reach out to <span className="text-white">{form.email}</span> to confirm details.
              </p>
              <button
                onClick={() => { setStatus('idle'); setStep('date'); setSelectedDate(null); setSelectedSlot(null); setForm({ name: '', email: '', phone: '', projectType: '', message: '' }) }}
                className="font-mono text-xs tracking-widest text-zinc-500 hover:text-white transition-colors uppercase"
              >
                Book Another →
              </button>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    )
  }

  return (
    <section className="py-28 sm:py-36 relative overflow-hidden bg-[#080808]" id="book">
      {/* Ambient glows */}
      <div className="absolute right-0 top-1/3 w-[40vw] h-[40vh] bg-[#00e5ff] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-0 w-[30vw] h-[30vh] bg-[#7c3aed] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Column: Header & Newsletter */}
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-5">
              <span className="block h-px w-8 bg-[#00e5ff]" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00e5ff]">Book a Session</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Let&apos;s scope<br />
              <span className="text-[#00e5ff]">your project.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-gray-500 text-sm leading-relaxed">
              Pick a time that works for you. I&apos;ll review your requirements, give you a precise quote, and we&apos;ll map out next steps.
            </motion.p>
          </div>

          <NewsletterSection />
        </div>

        {/* Right Column: Booking card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 sm:p-10 w-full">
            <StepBar current={step} />

            <AnimatePresence mode="wait">
              {/* ── STEP 1: Date ────────────────────────── */}
              {step === 'date' && (
                <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-white font-semibold mb-1">Choose a date</h3>
                  <p className="text-zinc-600 text-xs font-mono mb-6">Sundays unavailable · GMT+1</p>
                  <MiniCalendar selected={selectedDate} onSelect={d => { setSelectedDate(d); setStep('time') }} />
                </motion.div>
              )}

              {/* ── STEP 2: Time ────────────────────────── */}
              {step === 'time' && (
                <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-white font-semibold mb-1">Choose a time</h3>
                  <p className="text-zinc-600 text-xs font-mono mb-6">{selectedDate && formatDate(selectedDate)} · Lagos, Nigeria</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => { setSelectedSlot(slot.label); setStep('details') }}
                        className={`p-4 rounded-xl border text-left transition-all
                          ${selectedSlot === slot.label
                            ? 'border-[#00e5ff]/50 bg-[#00e5ff]/10 shadow-[0_0_16px_rgba(0,229,255,0.15)]'
                            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                      >
                        <p className="text-white font-semibold text-sm">{slot.label}</p>
                        <p className="text-zinc-600 text-xs font-mono mt-0.5">{slot.sub}</p>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep('date')} className="text-xs font-mono text-zinc-600 hover:text-white transition-colors">← Back</button>
                </motion.div>
              )}

              {/* ── STEP 3: Details ─────────────────────── */}
              {step === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-white font-semibold mb-1">Your details</h3>
                  <p className="text-zinc-600 text-xs font-mono mb-6">{selectedDate && formatDate(selectedDate)} · {selectedSlot}</p>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassInput label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Roqeeb Ismail" required />
                      <GlassInput label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@example.com" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassInput label="Phone / WhatsApp" type="tel" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+234 800 000 0000" />
                      <div>
                        <label className="block font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5">Project Type <span className="text-[#00e5ff]">*</span></label>
                        <select
                          value={form.projectType}
                          onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                          required
                          className="w-full bg-white/[0.03] border border-white/[0.08] text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#00e5ff]/50 transition-all font-mono appearance-none"
                        >
                          <option value="" className="bg-[#111]">Select type...</option>
                          {PROJECT_TYPES.map(t => <option key={t} value={t} className="bg-[#111]">{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5">Brief</label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Describe your project or what you need help with..."
                        rows={3}
                        className="w-full bg-white/[0.03] border border-white/[0.08] text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#00e5ff]/50 transition-all resize-none placeholder-zinc-700 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <button onClick={() => setStep('time')} className="text-xs font-mono text-zinc-600 hover:text-white transition-colors">← Back</button>
                    <button
                      onClick={() => {
                        if (!form.name || !form.email || !form.projectType) return
                        setStep('confirm')
                      }}
                      disabled={!form.name || !form.email || !form.projectType}
                      className="ml-auto px-6 py-2.5 bg-[#00e5ff] text-black text-sm font-semibold rounded-full hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Review Booking →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Confirm ─────────────────────── */}
              {step === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-white font-semibold mb-1">Confirm booking</h3>
                  <p className="text-zinc-600 text-xs font-mono mb-6">Review and submit</p>
                  <div className="flex flex-col gap-3 mb-8">
                    {[
                      { label: 'Date', value: selectedDate && formatDate(selectedDate) },
                      { label: 'Time', value: selectedSlot },
                      { label: 'Name', value: form.name },
                      { label: 'Email', value: form.email },
                      { label: 'Phone', value: form.phone || '—' },
                      { label: 'Project Type', value: form.projectType },
                      { label: 'Brief', value: form.message || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.04]">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 shrink-0">{label}</span>
                        <span className="text-sm text-zinc-300 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  {errorMsg && (
                    <p className="text-red-400 text-xs font-mono mb-4">Error: {errorMsg}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <button onClick={() => setStep('details')} className="text-xs font-mono text-zinc-600 hover:text-white transition-colors">← Edit</button>
                    <button
                      onClick={handleSubmit}
                      disabled={status === 'loading'}
                      className="ml-auto px-8 py-3 bg-[#00e5ff] text-black font-bold rounded-full hover:bg-white transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="30 60" /></svg>
                          Booking...
                        </>
                      ) : 'Confirm Session'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
