'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function PurchaseModal({ 
  isOpen, 
  onClose, 
  project 
}: { 
  isOpen: boolean, 
  onClose: () => void,
  project: { name: string, price: number, accentColor: string }
}) {
  const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'bank' | 'opay' | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
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
              
              <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="mb-8">
                <h2 className="text-xs tracking-[0.2em] uppercase text-gray-500 font-mono mb-2">Purchase Idea</h2>
                <h3 className="text-2xl font-bold font-sans text-white">{project.name}</h3>
                <div className="text-3xl font-bold mt-4 font-mono" style={{ color: project.accentColor }}>
                  ${project.price.toLocaleString()}
                </div>
              </div>

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
                  <button 
                    onClick={() => setSelectedMethod(null)}
                    className="text-xs font-mono text-gray-500 mb-6 flex items-center gap-1 hover:text-white"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to methods
                  </button>

                  {selectedMethod === 'paystack' && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400 mb-6">You will be redirected to the secure Paystack checkout portal.</p>
                      <button className="w-full bg-[#0ba4db] text-white py-4 rounded font-bold font-sans">
                        Proceed to Checkout
                      </button>
                    </div>
                  )}

                  {selectedMethod === 'bank' && (
                    <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] p-6 rounded text-sm text-gray-300 font-mono space-y-4">
                      <div><span className="text-gray-500">Bank:</span> Guaranty Trust Bank (GTB)</div>
                      <div><span className="text-gray-500">Account:</span> 0123456789</div>
                      <div><span className="text-gray-500">Name:</span> Raqīb Ismāʿīl</div>
                      <p className="text-xs text-gray-500 mt-4 font-sans">Please send proof of payment to rq.ismaeel@gmail.com after transfer.</p>
                    </div>
                  )}

                  {selectedMethod === 'opay' && (
                    <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] p-6 rounded text-sm text-gray-300 font-mono space-y-4">
                      <div><span className="text-gray-500">Opay Number:</span> 08123456789</div>
                      <div><span className="text-gray-500">Name:</span> Raqīb Ismāʿīl</div>
                      <p className="text-xs text-gray-500 mt-4 font-sans">Please send proof of payment to rq.ismaeel@gmail.com after transfer.</p>
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
