'use client'

import ErrorComponent from '@/components/ErrorComponent'

export default function ArticleError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorComponent
      title="Artikel nicht gefunden"
      message="Der Artikel konnte nicht geladen werden. Bitte versuche es später erneut."
      reset={reset}
    />
  )
}
