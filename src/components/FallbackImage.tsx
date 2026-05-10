'use client'

import { useState } from 'react'

interface FallbackImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackClassName?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'auto' | 'sync'
}

export default function FallbackImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackClassName,
  loading,
  fetchPriority,
  decoding,
}: FallbackImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className={fallbackClassName} aria-label={alt} role="img" />
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      onError={() => setFailed(true)}
    />
  )
}
