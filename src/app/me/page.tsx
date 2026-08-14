'use client'

import { motion } from 'framer-motion'

export default function AdminOverview() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold font-sans text-white mb-2">Studio Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back to the command center.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111] border border-[rgba(255,255,255,0.05)] p-6 rounded-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 font-mono mb-4">Total Projects</h3>
          <div className="text-4xl font-bold text-white font-mono">5</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111] border border-[rgba(255,255,255,0.05)] p-6 rounded-xl relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-[#00e5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 font-mono mb-4">Profile Views</h3>
          <div className="text-4xl font-bold text-[#00e5ff] font-mono">1.2k</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111] border border-[rgba(255,255,255,0.05)] p-6 rounded-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-gray-500 font-mono mb-4">System Status</h3>
          <div className="text-xl font-bold text-[#f59e0b] mt-2 font-mono flex items-center gap-2">
            <span className="w-3 h-3 bg-[#f59e0b] rounded-full animate-pulse" />
            ONLINE
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-xl p-8"
      >
        <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-500">Dashboard is connected to local SQLite database. System operational.</p>
      </motion.div>
    </div>
  )
}
