'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NewsletterSection } from './NewsletterSection'
import { MiniCalendar } from '../ui/booking/MiniCalendar'
import { GlassCard, GlassInput } from '../ui/booking/GlassForms'
import { StepBar, type BookingStep } from '../ui/booking/StepBar'
import { formatDate, toLocalDateString } from '@/lib/utils'
import { SpinnerIcon } from '@/components/icons'

// ── Types & Constants ─────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  'Web Application',
  'Mobile App',
  'UI / Design System',
  'Consultation',
  'Other',
]

const TIME_SLOTS = [
  { id: 'am', label: '9:00 AM', sub: 'Morning' },
  { id: 'noon', label: '1:00 PM', sub: 'Afternoon' },
  { id: 'eve', label: '5:00 PM', sub: 'Evening' },
]

type BookingForm = {
  name: string
  email: string
  phone: string
  projectType: string
  message: string
}

const EMPTY_FORM: BookingForm = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
}

// ── Custom hook — booking form state ──────────────────────────────────────────

function useBookingForm() {
  const [step, setStep] = useState<BookingStep>('date')
  const [selectedDate, setSelectedDateState] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[] | null>(null)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleDateSelect = async (d: Date) => {
    setSelectedDateState(d)
    setStep('time')
    setIsLoadingSlots(true)
    setAvailableSlots(null)

    try {
      const dateStr = toLocalDateString(d)
      const res = await fetch(`/api/booking/available?date=${dateStr}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch availability')
      }
      
      const data = await res.json()
      setAvailableSlots(data.availableSlots ?? [])
    } catch (err) {
      console.error('Booking API error:', err)
      // Fallback: show all slots on network or server error so users can still try to book
      setAvailableSlots(TIME_SLOTS.map(t => t.label))
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const handleSubmit = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const dateStr = selectedDate ? toLocalDateString(selectedDate) : ''
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: dateStr, timeSlot: selectedSlot }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Submission failed')
      setStatus('success')
    } catch (e: unknown) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Submission failed')
    }
  }

  const reset = () => {
    setStatus('idle')
    setStep('date')
    setSelectedDateState(null)
    setSelectedSlot(null)
    setAvailableSlots(null)
    setForm(EMPTY_FORM)
  }

  return {
    step, setStep,
    selectedDate,
    selectedSlot, setSelectedSlot,
    availableSlots,
    isLoadingSlots,
    form, setForm,
    status,
    errorMsg,
    handleDateSelect,
    handleSubmit,
    reset,
  }
}

// ── Main Section ──────────────────────────────────────────────────────────────

export function BookQuoteSection() {
  const {
    step, setStep,
    selectedDate,
    selectedSlot, setSelectedSlot,
    availableSlots,
    isLoadingSlots,
    form, setForm,
    status,
    errorMsg,
    handleDateSelect,
    handleSubmit,
    reset,
  } = useBookingForm()

  return (
    <section className="py-28 sm:py-36 relative overflow-hidden bg-[#080808]" id="book">
      {/* Ambient glows */}
      <div className="absolute right-0 top-1/3 w-[40vw] h-[40vh] bg-[#00e5ff] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-0 w-[30vw] h-[30vh] bg-[#7c3aed] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* Left Column: Header & Newsletter */}
        <div className="flex flex-col gap-12">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="block h-px w-8 bg-[#00e5ff]" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00e5ff]">Book a Session</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
            >
              Let&apos;s scope<br />
              <span className="text-[#00e5ff]">your project.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.2 }}
              className="text-[15px] text-gray-500 leading-[1.7]"
            >
              Pick a time that works for you. I&apos;ll review your requirements, give you a precise quote,
              and we&apos;ll map out next steps.
            </motion.p>
          </div>

          <NewsletterSection />
        </div>

        {/* Right Column: Booking card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 sm:p-10 w-full min-h-[500px]">
            <AnimatePresence mode="wait">

              {/* ── SUCCESS ──────────────────────────────────── */}
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-6 py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full border border-[#00e5ff]/30 bg-[#00e5ff]/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                    <svg className="w-8 h-8 text-[#00e5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Session Booked!</h3>
                  <p className="text-[15px] text-zinc-400 leading-[1.7] max-w-xs">
                    Your quote session is confirmed for{' '}
                    <span className="text-[#00e5ff]">{selectedDate && formatDate(selectedDate)}</span> at{' '}
                    <span className="text-[#00e5ff]">{selectedSlot}</span>.{' '}
                    I&apos;ll reach out to <span className="text-white">{form.email}</span> to confirm details.
                    A Google Meet invite has also been sent to your email.
                  </p>
                  <button
                    onClick={reset}
                    className="font-mono text-xs tracking-widest text-zinc-500 hover:text-white transition-colors uppercase"
                  >
                    Book Another →
                  </button>
                </motion.div>
              ) : (
                /* ── BOOKING STEPS ─────────────────────────────── */
                <motion.div key="steps" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                  <StepBar current={step} />

                  <AnimatePresence mode="wait">
                    {/* STEP 1: Date */}
                    {step === 'date' && (
                      <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                        <h3 className="text-white font-semibold mb-1">Choose a date</h3>
                        <p className="text-zinc-600 text-xs font-mono mb-6">Sundays unavailable · GMT+1</p>
                        <MiniCalendar selected={selectedDate} onSelect={handleDateSelect} />
                      </motion.div>
                    )}

                    {/* STEP 2: Time */}
                    {step === 'time' && (
                      <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                        <h3 className="text-white font-semibold mb-1">Choose a time</h3>
                        <p className="text-zinc-600 text-xs font-mono mb-6">
                          {selectedDate && formatDate(selectedDate)} · Lagos, Nigeria
                        </p>

                        {isLoadingSlots ? (
                          <div className="py-8 flex justify-center items-center gap-3">
                            <SpinnerIcon className="w-5 h-5 text-[#00e5ff] animate-spin" />
                            <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Checking availability...</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                            {TIME_SLOTS.map(slot => {
                              const isAvailable = availableSlots === null
                                ? true
                                : availableSlots.includes(slot.label)
                              return (
                                <button
                                  key={slot.id}
                                  disabled={!isAvailable}
                                  onClick={() => { setSelectedSlot(slot.label); setStep('details') }}
                                  className={`p-4 rounded-xl border text-left transition-all
                                    ${!isAvailable
                                      ? 'border-white/[0.02] bg-white/[0.01] opacity-50 cursor-not-allowed'
                                      : selectedSlot === slot.label
                                      ? 'border-[#00e5ff]/50 bg-[#00e5ff]/10 shadow-[0_0_16px_rgba(0,229,255,0.15)]'
                                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                    }`}
                                >
                                  <p className={`font-semibold text-sm ${!isAvailable ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                    {slot.label}
                                  </p>
                                  <p className="text-zinc-600 text-xs font-mono mt-0.5">
                                    {!isAvailable ? 'Booked' : slot.sub}
                                  </p>
                                </button>
                              )
                            })}
                          </div>
                        )}
                        <button onClick={() => setStep('date')} className="text-xs font-mono text-zinc-600 hover:text-white transition-colors">
                          ← Back
                        </button>
                      </motion.div>
                    )}

                    {/* STEP 3: Details */}
                    {step === 'details' && (
                      <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                        <h3 className="text-white font-semibold mb-1">Your details</h3>
                        <p className="text-zinc-600 text-xs font-mono mb-6">
                          {selectedDate && formatDate(selectedDate)} · {selectedSlot}
                        </p>
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <GlassInput label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Raqīb Ismāʿīl" required />
                            <GlassInput label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@example.com" required />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <GlassInput label="Phone / WhatsApp" type="tel" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+234 800 000 0000" />
                            <div>
                              <label className="block font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5">
                                Project Type <span className="text-[#00e5ff]">*</span>
                              </label>
                              <select
                                value={form.projectType}
                                onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                                required
                                className="w-full bg-white/[0.03] border border-white/[0.08] text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#00e5ff]/50 transition-all font-mono appearance-none"
                              >
                                <option value="" className="bg-[#111]">Select type...</option>
                                {PROJECT_TYPES.map(t => (
                                  <option key={t} value={t} className="bg-[#111]">{t}</option>
                                ))}
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

                    {/* STEP 4: Confirm */}
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
                                <SpinnerIcon className="w-4 h-4 animate-spin" />
                                Booking...
                              </>
                            ) : 'Confirm Session'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
