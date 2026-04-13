'use client'

import { useEffect, useRef } from 'react'
import styles from './GiscusComments.module.css'

interface GiscusCommentsProps {
  title?: string
}

export default function GiscusComments({ title }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('.giscus')) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'your-repo')
    script.setAttribute('data-repo-id', 'your-repo-id')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', 'DIC_kwDOGN')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'transparent_dark')
    script.setAttribute('data-lang', 'de')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true

    ref.current.appendChild(script)

    // Update theme when it changes
    const observer = new MutationObserver(() => {
      const iframe = ref.current?.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
      if (iframe?.contentWindow) {
        const theme = document.documentElement.getAttribute('data-theme') === 'light'
          ? 'light'
          : 'transparent_dark'
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme } } },
          'https://giscus.app'
        )
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Kommentare</h2>
      <div ref={ref} className={styles.giscus} />
    </section>
  )
}