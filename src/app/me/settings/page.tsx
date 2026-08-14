'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState('Roqeeb Ismail')
  const [tagline, setTagline] = useState('Software Engineer · Visual Designer · Microsoldering Specialist')
  const [email, setEmail] = useState('rq.ismaeel@gmail.com')
  const [location, setLocation] = useState('Lagos, Nigeria')
  const [openToWork, setOpenToWork] = useState(true)

  const handleSave = async () => {
    // Future: persist to API
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-bold font-sans text-white mb-2">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your profile, appearance, and account preferences.</p>
      </motion.div>

      <div className="space-y-6">

        {/* Profile Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden"
        >
          <div className="px-8 py-5 border-b border-[rgba(255,255,255,0.05)]">
            <h2 className="text-sm font-mono tracking-[0.15em] uppercase text-gray-400">Profile</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-gray-500 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-[#00e5ff] transition-colors font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-gray-500 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-[#00e5ff] transition-colors font-sans"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-gray-500 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-[#00e5ff] transition-colors font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-gray-500 mb-2">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-[#00e5ff] transition-colors font-sans"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-[rgba(255,255,255,0.05)]">
              <div>
                <p className="text-sm text-white font-medium">Open to Work</p>
                <p className="text-xs text-gray-500 mt-0.5">Displays a badge on your hero section</p>
              </div>
              <button
                onClick={() => setOpenToWork(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${openToWork ? 'bg-[#00e5ff]' : 'bg-[rgba(255,255,255,0.1)]'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${openToWork ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Appearance Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden"
        >
          <div className="px-8 py-5 border-b border-[rgba(255,255,255,0.05)]">
            <h2 className="text-sm font-mono tracking-[0.15em] uppercase text-gray-400">Appearance</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Cyber Dark (Default)', 'Midnight Blue', 'Obsidian Green'].map((theme, i) => (
                <button
                  key={theme}
                  className={`p-4 rounded-lg border text-left transition-all ${i === 0 ? 'border-[#00e5ff] bg-[#00e5ff]/5' : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]'}`}
                >
                  <div className={`w-full h-8 rounded mb-3 ${i === 0 ? 'bg-gradient-to-r from-[#00e5ff]/20 to-[#7c3aed]/20' : i === 1 ? 'bg-gradient-to-r from-blue-500/20 to-blue-900/20' : 'bg-gradient-to-r from-green-500/20 to-emerald-900/20'}`} />
                  <p className="text-xs font-mono text-gray-400">{theme}</p>
                  {i === 0 && <p className="text-[10px] text-[#00e5ff] mt-1">Active</p>}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111] border border-red-500/20 rounded-xl overflow-hidden"
        >
          <div className="px-8 py-5 border-b border-red-500/10">
            <h2 className="text-sm font-mono tracking-[0.15em] uppercase text-red-500/70">Danger Zone</h2>
          </div>
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[rgba(255,255,255,0.05)]">
              <div>
                <p className="text-sm text-white font-medium">Clear All Projects</p>
                <p className="text-xs text-gray-500 mt-0.5">Move all projects to Trash</p>
              </div>
              <button className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors border border-red-500/20 px-4 py-2 rounded-lg hover:border-red-500/40">
                CLEAR PROJECTS
              </button>
            </div>

          </div>
        </motion.section>

        {/* Save Button */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            className={`px-8 py-3 text-sm font-semibold font-sans transition-all duration-300 ${
              saved
                ? 'bg-green-500 text-black'
                : 'bg-[#00e5ff] text-black hover:bg-white'
            }`}
          >
            {saved ? '✓ SAVED' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  )
}
