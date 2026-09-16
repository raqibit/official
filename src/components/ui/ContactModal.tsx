'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'

export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    inquiryType: 'Hire for a software project',
    budget: 'Select budget...',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to send message')
      }

      setIsSuccess(true)
    } catch {
      setError('Something went wrong. Please try again or email me directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state after closing animation
    setTimeout(() => {
      setIsSuccess(false)
      setError('')
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        company: '',
        inquiryType: 'Hire for a software project',
        budget: 'Select budget...',
        message: ''
      })
    }, 500)
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-[#080808]/80 backdrop-blur-md transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden bg-[#111] border border-white/[0.05] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg rounded-2xl min-h-[400px]">
            
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="px-8 pt-10 pb-12"
                >
                  <div className="flex items-center justify-between mb-8">
                    <DialogTitle as="h3" className="text-2xl font-light tracking-tighter text-white">
                      Get in touch
                    </DialogTitle>
                    <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
                      <span className="sr-only">Close</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3">Name</label>
                        <input required type="text" id="name" value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-white/[0.05] rounded-none px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors" placeholder="Jane Doe" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3">Email Address</label>
                        <input required type="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-black/50 border border-white/[0.05] rounded-none px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors" placeholder="hello@example.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="whatsapp" className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3">WhatsApp (Optional)</label>
                        <input type="tel" id="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-black/50 border border-white/[0.05] rounded-none px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3">Company (Optional)</label>
                        <input type="text" id="company" value={formData.company} onChange={handleChange} className="w-full bg-black/50 border border-white/[0.05] rounded-none px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors" placeholder="Acme Corp" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="inquiryType" className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3">I am looking to...</label>
                        <select id="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full bg-black/50 border border-white/[0.05] rounded-none px-4 py-3.5 text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors appearance-none">
                          <option>Hire for a software project</option>
                          <option>Book a microsoldering repair</option>
                          <option>General inquiry / Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="budget" className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3">Budget</label>
                        <select id="budget" value={formData.budget} onChange={handleChange} className="w-full bg-black/50 border border-white/[0.05] rounded-none px-4 py-3.5 text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors appearance-none">
                          <option>Select budget...</option>
                          <option>Less than $1,000</option>
                          <option>$1,000 - $3,000</option>
                          <option>$3,000 - $10,000</option>
                          <option>$10,000+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-3">How may I be of service?</label>
                      <textarea required id="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-black/50 border border-white/[0.05] rounded-none px-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors resize-none" placeholder="Tell me about your project..."></textarea>
                    </div>

                    <div className="pt-2">
                      <button disabled={isSubmitting} type="submit" className="w-full inline-flex justify-center items-center gap-3 px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-black bg-white hover:bg-[#00e5ff] disabled:opacity-50 transition-all duration-500">
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-8 py-20 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <div className="w-16 h-16 bg-[#00e5ff]/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-[#00e5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Message Sent</h3>
                  <p className="text-gray-400 text-sm max-w-[250px] mx-auto mb-8">
                    Thanks for reaching out, {formData.name.split(' ')[0] || 'there'}. I&apos;ll get back to you shortly.
                  </p>
                  <button onClick={handleClose} className="px-8 py-3 text-xs font-semibold tracking-widest uppercase border border-gray-700 hover:border-white text-white rounded-full transition-colors">
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
