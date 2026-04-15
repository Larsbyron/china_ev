import { describe, it, expect } from 'vitest'
import { validateUrl, sanitizeUrl } from '../scraper/ssrf'

describe('SSRF Protection', () => {
  describe('validateUrl', () => {
    describe('valid URLs', () => {
      it('allows valid HTTPS URLs', () => {
        expect(validateUrl('https://example.com')).toEqual({ valid: true })
        expect(validateUrl('https://cnevpost.com')).toEqual({ valid: true })
        expect(validateUrl('https://electrek.co/feed/')).toEqual({ valid: true })
      })

      it('allows valid HTTP URLs', () => {
        expect(validateUrl('http://example.com')).toEqual({ valid: true })
      })

      it('allows URLs with ports', () => {
        expect(validateUrl('https://example.com:443/path')).toEqual({ valid: true })
        expect(validateUrl('http://example.com:8080/api')).toEqual({ valid: true })
      })

      it('allows URLs with paths and query strings', () => {
        expect(validateUrl('https://example.com/path/to/article?id=123')).toEqual({ valid: true })
      })

      it('allows international domains', () => {
        expect(validateUrl('https://www.新浪.com')).toEqual({ valid: true })
      })
    })

    describe('blocked protocols', () => {
      it('blocks file:// protocol', () => {
        const result = validateUrl('file:///etc/passwd')
        expect(result.valid).toBe(false)
        expect(result.reason).toContain('Blocked protocol')
      })

      it('blocks ftp:// protocol', () => {
        const result = validateUrl('ftp://example.com/file')
        expect(result.valid).toBe(false)
        expect(result.reason).toContain('Blocked protocol')
      })

      it('blocks data:// protocol', () => {
        const result = validateUrl('data:text/html,<script>alert(1)</script>')
        expect(result.valid).toBe(false)
        expect(result.reason).toContain('Blocked protocol')
      })
    })

    describe('blocked hostnames', () => {
      it('blocks localhost', () => {
        expect(validateUrl('http://localhost')).toEqual({ valid: false, reason: 'Blocked hostname: localhost' })
        expect(validateUrl('http://localhost.localdomain')).toEqual({ valid: false, reason: 'Blocked hostname: localhost.localdomain' })
      })

      it('blocks ip6-localhost', () => {
        expect(validateUrl('http://ip6-localhost')).toEqual({ valid: false, reason: 'Blocked hostname: ip6-localhost' })
      })

      it('blocks 0.0.0.0', () => {
        expect(validateUrl('http://0.0.0.0')).toEqual({ valid: false, reason: 'Blocked hostname: 0.0.0.0' })
      })

      it('blocks cloud metadata endpoints', () => {
        expect(validateUrl('http://169.254.169.254/latest/meta-data')).toEqual({ valid: false, reason: 'Blocked hostname: 169.254.169.254' })
        expect(validateUrl('http://metadata.google.internal')).toEqual({ valid: false, reason: 'Blocked hostname: metadata.google.internal' })
        expect(validateUrl('http://metadata.azure.com')).toEqual({ valid: false, reason: 'Blocked hostname: metadata.azure.com' })
      })

      it('blocks kubernetes.default.svc', () => {
        expect(validateUrl('http://kubernetes.default.svc')).toEqual({ valid: false, reason: 'Blocked hostname: kubernetes.default.svc' })
      })
    })

    describe('private IP ranges', () => {
      it('blocks Class A private network (10.x.x.x)', () => {
        expect(validateUrl('http://10.0.0.1').valid).toBe(false)
        expect(validateUrl('http://10.255.255.255').valid).toBe(false)
      })

      it('blocks Class B private network (172.16-31.x.x)', () => {
        expect(validateUrl('http://172.16.0.1').valid).toBe(false)
        expect(validateUrl('http://172.31.255.255').valid).toBe(false)
      })

      it('blocks Class C private network (192.168.x.x)', () => {
        expect(validateUrl('http://192.168.0.1').valid).toBe(false)
        expect(validateUrl('http://192.168.255.255').valid).toBe(false)
      })

      it('blocks loopback addresses (127.x.x.x)', () => {
        expect(validateUrl('http://127.0.0.1').valid).toBe(false)
        expect(validateUrl('http://127.255.255.255').valid).toBe(false)
      })

      it('blocks link-local addresses (169.254.x.x)', () => {
        expect(validateUrl('http://169.254.0.1').valid).toBe(false)
        expect(validateUrl('http://169.254.169.254').valid).toBe(false)
      })

      it('blocks multicast addresses (224.x.x.x)', () => {
        expect(validateUrl('http://224.0.0.1').valid).toBe(false)
      })

      it('blocks reserved addresses (240.x.x.x)', () => {
        expect(validateUrl('http://240.0.0.1').valid).toBe(false)
      })

      it('blocks current network (0.x.x.x)', () => {
        expect(validateUrl('http://0.1.2.3').valid).toBe(false)
      })
    })

    describe('IPv6 addresses', () => {
      it('blocks IPv6 loopback (::1)', () => {
        // Note: Current implementation may not fully block IPv6 in bracket notation
        // This is a known gap - IPv6 blocking needs improvement
        expect(validateUrl('http://[::1]').valid).toBe(false)
      })

      it('blocks IPv6 private (fc00:/i)', () => {
        expect(validateUrl('http://[fc00::1]').valid).toBe(false)
      })

      it('blocks IPv6 link-local (fe80:/i)', () => {
        expect(validateUrl('http://[fe80::1]').valid).toBe(false)
      })

      it('blocks IPv6 site-local (fec0:/i)', () => {
        expect(validateUrl('http://[fec0::1]').valid).toBe(false)
      })

      it('blocks IPv6 documentation (2001:db8:)', () => {
        expect(validateUrl('http://[2001:db8::1]').valid).toBe(false)
      })

      it('blocks IPv4-mapped IPv6 (::ffff:)', () => {
        expect(validateUrl('http://[::ffff:192.168.1.1]').valid).toBe(false)
      })
    })

    describe('URLs with credentials', () => {
      it('blocks URLs with username', () => {
        const result = validateUrl('https://user@example.com')
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Credentials in URL not allowed')
      })

      it('blocks URLs with password', () => {
        const result = validateUrl('https://user:pass@example.com')
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Credentials in URL not allowed')
      })
    })

    describe('invalid URLs', () => {
      it('returns invalid for malformed URLs', () => {
        const result = validateUrl('not-a-valid-url')
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Invalid URL format')
      })

      it('returns invalid for empty string', () => {
        const result = validateUrl('')
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Invalid URL format')
      })
    })
  })

  describe('sanitizeUrl', () => {
    it('returns the URL if valid', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
    })

    it('throws an error if URL is invalid', () => {
      expect(() => sanitizeUrl('http://localhost')).toThrow('SSRF block')
      expect(() => sanitizeUrl('http://10.0.0.1')).toThrow('SSRF block')
    })
  })
})
