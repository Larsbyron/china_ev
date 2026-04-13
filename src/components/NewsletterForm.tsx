'use client'

import styles from './NewsletterForm.module.css'

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = new FormData(form).get('email') as string
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email)
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
      />
      <button type="submit" className={styles.button}>
        Abonnieren
      </button>
    </form>
  )
}