'use client'

import ErrorComponent from '@/components/ErrorComponent'

export default function BrandsError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorComponent
      title="Marken konnten nicht geladen werden"
      message="Die Markenliste ist momentan nicht verfügbar. Bitte versuche es später erneut."
      reset={reset}
    />
  )
}
