'use client'

import ErrorComponent from '@/components/ErrorComponent'

export default function WeeklyError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorComponent
      title="Digest konnte nicht geladen werden"
      message="Der wöchentliche Digest ist momentan nicht verfügbar. Bitte versuche es später erneut."
      reset={reset}
    />
  )
}
