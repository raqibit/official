'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ImageUploader } from '@/components/ui/ImageUploader'

export default function AdminProjectEditor({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const isNew = id === 'new'
  
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    about: '',
    videoUrl: '',
    liveUrl: '',
    githubUrl: '',
    techStack: '',
    images: '',
    review: '',
    price: '',
    accentColor: '#00e5ff',
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setFormData({
              ...data,
              techStack: data.techStack ? data.techStack.join(', ') : '',
              images: data.images ? data.images.join(', ') : '',
              price: data.price ? data.price.toString() : '',
            })
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const payload = {
      ...formData,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      price: parseFloat(formData.price) || 0,
    }

    const res = await fetch(`/api/projects${isNew ? '' : `/${id}`}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/me/projects')
    } else {
      setSaving(false)
      alert('Failed to save project.')
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-500 font-mono">Loading...</div>
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <Link href="/me/projects" className="text-gray-500 hover:text-white text-sm font-mono flex items-center gap-2 mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          BACK TO PROJECTS
        </Link>
        <h1 className="text-3xl font-bold font-sans text-white">{isNew ? 'New Project' : 'Edit Project'}</h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-8 bg-[#111] border border-[rgba(255,255,255,0.05)] p-8 rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Project Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Accent Color</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={formData.accentColor}
                onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-12 h-12 rounded bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={formData.accentColor}
                onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                className="flex-1 bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Tagline (Short Summary)</label>
          <input
            type="text"
            required
            value={formData.tagline}
            onChange={e => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">About Project</label>
          <textarea
            required
            rows={5}
            value={formData.about}
            onChange={e => setFormData({ ...formData, about: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Live URL</label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Hover Video URL (.mp4)</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="https://.../video.mp4"
            className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Tech Stack (comma separated)</label>
          <input
            type="text"
            value={formData.techStack}
            onChange={e => setFormData({ ...formData, techStack: e.target.value })}
            placeholder="React, Next.js, Tailwind..."
            className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Images (comma separated URLs)</label>
          <div className="space-y-4">
            <ImageUploader 
              disabled={saving}
              onUploadSuccess={(url) => {
                setFormData(prev => ({
                  ...prev,
                  images: prev.images ? `${prev.images}, ${url}` : url
                }))
              }} 
            />
            <input
              type="text"
              value={formData.images}
              onChange={e => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://.../img1.png, https://.../img2.png"
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[rgba(255,255,255,0.05)]">
          <h3 className="text-lg font-bold text-white mb-6">Purchase Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-8 bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Client Review / Testimonial</label>
            <textarea
              rows={3}
              value={formData.review}
              onChange={e => setFormData({ ...formData, review: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded p-3 text-white focus:border-[#00e5ff] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#00e5ff] text-black font-bold font-mono tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : (isNew ? 'Create Project' : 'Save Changes')}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
