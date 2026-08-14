'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Project = {
  id: string
  name: string
  tagline: string
  accentColor: string
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // We will fetch from our API once it's built
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-sans text-white mb-2">Projects</h1>
          <p className="text-gray-500 text-sm">Manage your portfolio items and pricing.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link
            href="/me/projects/new"
            className="px-6 py-3 bg-[#00e5ff] text-black font-semibold text-sm hover:bg-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            ADD PROJECT
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)]">
              <th className="p-6 text-xs tracking-[0.1em] uppercase text-gray-500 font-mono font-medium">Name</th>
              <th className="p-6 text-xs tracking-[0.1em] uppercase text-gray-500 font-mono font-medium">Tagline</th>
              <th className="p-6 text-xs tracking-[0.1em] uppercase text-gray-500 font-mono font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500 text-sm">Loading projects...</td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500 text-sm">No projects found. Create your first one.</td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: project.accentColor }} />
                      <span className="font-bold text-white group-hover:text-[#00e5ff] transition-colors">{project.name}</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-gray-400">{project.tagline}</td>
                  <td className="p-6 text-right">
                    <Link
                      href={`/me/projects/${project.id}`}
                      className="text-xs font-mono text-[#00e5ff] hover:text-white transition-colors"
                    >
                      EDIT
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
