'use client'

/**
 * PurchaseModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Payment method selection overlay for purchasing project ideas.
 * Supports Paystack (online), bank transfer, and OPay.
 *
 * Bank/OPay account details are read from environment variables so sensitive
 * financial information is never hardcoded in the codebase. Set the following
 * in your .env file:
 *
 *   NEXT_PUBLIC_BANK_NAME="Guaranty Trust Bank (GTB)"
 *   NEXT_PUBLIC_BANK_ACCOUNT="0123456789"
 *   NEXT_PUBLIC_BANK_HOLDER="Raqīb Ismāʿīl"
 *   NEXT_PUBLIC_OPAY_NUMBER="08123456789"
 *   NEXT_PUBLIC_OPAY_HOLDER="Raqīb Ismāʿīl"
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloseIcon, BackChevronIcon } from '@/components/icons'
import { OWNER_EMAIL } from '@/data/site'

// ── Environment-driven payment details ────────────────────────────────────────
// Using NEXT_PUBLIC_ prefix so they're available on the client.
// Default fallbacks are shown if env vars are missing.

const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || 'Guaranty Trust Bank (GTB)'
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || '—'
const BANK_HOLDER = process.env.NEXT_PUBLIC_BANK_HOLDER || 'Raqīb Ismāʿīl'
const OPAY_NUMBER = process.env.NEXT_PUBLIC_OPAY_NUMBER || '—'
const OPAY_HOLDER = process.env.NEXT_PUBLIC_OPAY_HOLDER || 'Raqīb Ismāʿīl'

export function PurchaseModal({
  isOpen,
  onClose,
  project,
}: {
  isOpen: boolean
  onClose: () => void
  project: { name: string; price: number; accentColor: string }
}) {
  const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'bank' | 'opay' | null>(null)

  /** Reset method selection when closing so it's clean on reopen */
  const handleClose = () => {
    onClose()
    setTimeout(() => setSelectedMethod(null), 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 max-w-md w-full pointer-events-auto relative overflow-hidden"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: project.accentColor }}
              />

              {/* Close button */}
              <button
                onClick={handleClose}
                aria-label="Close"
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <CloseIcon />
              </button>

              {/* Header — project name + price */}
              <div className="mb-8">
                <h2 className="text-xs tracking-[0.2em] uppercase text-gray-500 font-mono mb-2">
                  Purchase Idea
                </h2>
                <h3 className="text-2xl font-bold font-sans text-white">{project.name}</h3>
                <div
                  className="text-3xl font-bold mt-4 font-mono"
                  style={{ color: project.accentColor }}
                >
                  ${project.price.toLocaleString()}
                </div>
              </div>

              {/* Method selection or detail view */}
              {!selectedMethod ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedMethod('paystack')}
                    className="w-full bg-[#0ba4db] hover:bg-[#098bbd] text-white py-4 rounded font-bold font-sans transition-colors flex items-center justify-center gap-2"
                  >
                    Pay via Paystack
                  </button>
                  <button
                    onClick={() => setSelectedMethod('bank')}
                    className="w-full bg-[#222] hover:bg-[#333] text-white py-4 rounded font-bold font-sans transition-colors border border-[rgba(255,255,255,0.05)]"
                  >
                    Bank Transfer
                  </button>
                  <button
                    onClick={() => setSelectedMethod('opay')}
                    className="w-full bg-[#1dbf73] hover:bg-[#189e5f] text-white py-4 rounded font-bold font-sans transition-colors"
                  >
                    Pay via Opay
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {/* Back button */}
                  <button
                    onClick={() => setSelectedMethod(null)}
                    className="text-xs font-mono text-gray-500 mb-6 flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <BackChevronIcon />
                    Back to methods
                  </button>

                  {/* Paystack */}
                  {selectedMethod === 'paystack' && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400 mb-6">
                        You will be redirected to the secure Paystack checkout portal.
                      </p>
                      <button className="w-full bg-[#0ba4db] text-white py-4 rounded font-bold font-sans">
                        Proceed to Checkout
                      </button>
                    </div>
                  )}

                  {/* Bank transfer — details from environment variables */}
                  {selectedMethod === 'bank' && (
                    <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] p-6 rounded text-sm text-gray-300 font-mono space-y-4">
                      <div><span className="text-gray-500">Bank:</span> {BANK_NAME}</div>
                      <div><span className="text-gray-500">Account:</span> {BANK_ACCOUNT}</div>
                      <div><span className="text-gray-500">Name:</span> {BANK_HOLDER}</div>
                      <p className="text-xs text-gray-500 mt-4 font-sans">
                        Please send proof of payment to {OWNER_EMAIL} after transfer.
                      </p>
                    </div>
                  )}

                  {/* OPay — details from environment variables */}
                  {selectedMethod === 'opay' && (
                    <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] p-6 rounded text-sm text-gray-300 font-mono space-y-4">
                      <div><span className="text-gray-500">Opay Number:</span> {OPAY_NUMBER}</div>
                      <div><span className="text-gray-500">Name:</span> {OPAY_HOLDER}</div>
                      <p className="text-xs text-gray-500 mt-4 font-sans">
                        Please send proof of payment to {OWNER_EMAIL} after transfer.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
