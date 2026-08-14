'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setStatus('loading')
    // Simulate API call — replace with Resend/Mailchimp later
    await new Promise(r => setTimeout(r, 900))
    setStatus('success')
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 sm:p-12 text-center" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full bg-[#00e5ff] opacity-[0.04] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="block h-px w-8 bg-[#00e5ff]" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#00e5ff]">Newsletter</span>
          <span className="block h-px w-8 bg-[#00e5ff]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
        >
          Stay in the loop.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-sm leading-relaxed mb-10 max-w-md mx-auto"
        >
          Get notified about new projects, hardware experiments, and design essays.
          No spam. Unsubscribe anytime.
        </motion.p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#00e5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold">You&apos;re subscribed!</p>
              <p className="text-gray-500 text-sm">Thanks for joining. I&apos;ll be in touch.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-[#111] border border-[rgba(255,255,255,0.08)] text-white text-sm px-5 py-3.5 rounded-full focus:outline-none focus:border-[#00e5ff]/60 focus:ring-1 focus:ring-[#00e5ff]/20 transition-all placeholder-gray-600 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="shrink-0 px-6 py-3.5 bg-[#00e5ff] text-black text-sm font-semibold rounded-full hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="30 60" />
                    </svg>
                    Subscribing...
                  </span>
                ) : 'Subscribe'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
