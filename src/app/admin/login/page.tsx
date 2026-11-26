'use client'

import { signIn } from 'next-auth/react'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/admin'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid password.')
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-xs font-medium text-zinc-400 mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#00e5ff] transition-colors"
          placeholder="Enter admin password"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#00e5ff] text-black font-semibold py-3 rounded-lg text-sm hover:bg-[#00c8e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-10 text-center">
          <span className="text-4xl font-black tracking-tight text-white">
            raqibit<span className="text-[#00e5ff]">.</span>
          </span>
          <p className="mt-2 text-sm text-zinc-500">Admin · Portfolio OS</p>
        </div>

        <Suspense fallback={<div className="h-36 bg-zinc-900 rounded-lg animate-pulse" />}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  )
}
