'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

type TrashedItem = {
  id: string
  name?: string
  title?: string
  deletedAt: string
  accentColor: string
}

export default function TrashPage() {
  const [items, setItems] = useState<TrashedItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = () => {
    setLoading(true)
    fetch(`/api/trash/projects`)
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleRestore = async (id: string) => {
    if (!confirm('Restore this item to the live site?')) return
    const res = await fetch(`/api/trash/projects/${id}`, { method: 'PATCH' })
    if (res.ok) {
      setItems(prev => prev.filter(item => item.id !== id))
    } else {
      alert('Failed to restore item')
    }
  }

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('WARNING: This will permanently delete the item. This action cannot be undone. Proceed?')) return
    const res = await fetch(`/api/trash/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setItems(prev => prev.filter(item => item.id !== id))
    } else {
      alert('Failed to permanently delete item')
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-sans text-white mb-2">Trash</h1>
          <p className="text-gray-500 text-sm">Recover or permanently delete removed items.</p>
        </motion.div>
      </div>



      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)]">
              <th className="p-6 text-xs tracking-[0.1em] uppercase text-gray-500 font-mono font-medium">Name</th>
              <th className="p-6 text-xs tracking-[0.1em] uppercase text-gray-500 font-mono font-medium">Deleted On</th>
              <th className="p-6 text-xs tracking-[0.1em] uppercase text-gray-500 font-mono font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500 text-sm">Loading trash...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500 text-sm">Trash is empty.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: item.accentColor }} />
                      <span className="font-bold text-gray-400 group-hover:text-white transition-colors">
                        {item.name || item.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-gray-500">
                    {new Date(item.deletedAt).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-right space-x-4">
                    <button
                      onClick={() => handleRestore(item.id)}
                      className="text-xs font-mono text-green-500 hover:text-green-400 transition-colors"
                    >
                      RESTORE
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(item.id)}
                      className="text-xs font-mono text-red-500 hover:text-red-400 transition-colors"
                    >
                      DELETE PERMANENTLY
                    </button>
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
