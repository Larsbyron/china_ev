'use client'

import { useState } from 'react'
import styles from './NewsletterForm.module.css'

export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = new FormData(form).get('email') as string

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? 'Fehler beim Anmelden.')
      }

      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Unbekannter Fehler.'
      )
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        Danke fuer deine Anmeldung! Du erhaelst bald eine Bestaetigung.
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="deine@email.de"
        className={styles.input}
        aria-label="E-Mail-Adresse"
        required
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Wird angemeldet...' : 'Abonnieren'}
      </button>
      {status === 'error' && errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}
