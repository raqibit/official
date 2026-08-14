'use client'

import { useState, useCallback, useRef } from 'react'

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void
  disabled?: boolean
}

export function ImageUploader({ onUploadSuccess, disabled }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    setIsUploading(true)
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      })

      if (!res.ok) {
        throw new Error('Upload failed')
      }

      const data = await res.json()
      onUploadSuccess(data.url)
    } catch (error) {
      console.error(error)
      alert('Upload failed. Did you configure Vercel Blob token?')
    } finally {
      setIsUploading(false)
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled || isUploading) return
    
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }, [disabled, isUploading])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        isDragging ? 'border-[#00e5ff] bg-[rgba(0,229,255,0.05)]' : 'border-[rgba(255,255,255,0.1)] bg-[#0a0a0a]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[rgba(255,255,255,0.3)]'}`}
      onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      {isUploading ? (
        <div className="text-gray-400 font-mono text-sm animate-pulse">Uploading...</div>
      ) : (
        <div>
          <svg className="w-8 h-8 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <p className="text-sm text-gray-300 font-sans mb-1">Drag and drop an image here</p>
          <p className="text-xs text-gray-500 font-mono">or click to browse</p>
        </div>
      )}
    </div>
  )
}
