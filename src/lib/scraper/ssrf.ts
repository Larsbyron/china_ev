/**
 * SSRF Prevention Utility
 *
 * Validates URLs to prevent Server-Side Request Forgery attacks.
 * Blocks requests to private IP ranges, localhost, and internal networks.
 */

import { URL } from 'url'

// Private IP ranges to block
const PRIVATE_IP_PATTERNS = [
  /^127\./,                    // Loopback
  /^10\./,                     // Class A private
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Class B private
  /^192\.168\./,               // Class C private
  /^169\.254\./,               // Link-local
  /^0\./,                      // Current network
  /^224\./,                    // Multicast
  /^240\./,                    // Reserved
  /^::1$/,                     // IPv6 loopback
  /^fc00:/i,                   // IPv6 private
  /^fe80:/i,                   // IPv6 link-local
  /^fec0:/i,                   // IPv6 site-local
  /^2001:db8:/i,               // IPv6 documentation
  /^::ffff:/i,                 // IPv4-mapped IPv6
]

// Blocked hostnames
const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  'ip6-localhost',
  'ip6-loopback',
  '0.0.0.0',
  'metadata.google.internal',
  'metadata.internal',
  '169.254.169.254',
  'metadata.azure.com',
  'kubernetes.default.svc',
]

/**
 * Check if a hostname is blocked
 */
function isHostnameBlocked(hostname: string): boolean {
  const lower = hostname.toLowerCase()
  if (BLOCKED_HOSTNAMES.includes(lower)) {
    return true
  }
  // Check for IP addresses
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return isPrivateIP(hostname)
  }
  return false
}

/**
 * Check if an IP address is private
 */
function isPrivateIP(ip: string): boolean {
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(ip))
}

/**
 * Validate a URL for SSRF vulnerabilities
 * Returns { valid: true } if safe, or { valid: false, reason: string } if blocked
 */
export function validateUrl(rawUrl: string): { valid: boolean; reason?: string } {
  try {
    const url = new URL(rawUrl)

    // Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, reason: `Blocked protocol: ${url.protocol}` }
    }

    // Check hostname
    if (isHostnameBlocked(url.hostname)) {
      return { valid: false, reason: `Blocked hostname: ${url.hostname}` }
    }

    // Check for IP literals
    if (url.hostname === url.host) {
      // It's an IP literal
      if (isPrivateIP(url.hostname)) {
        return { valid: false, reason: `Private IP blocked: ${url.hostname}` }
      }
    }

    // Check for credentials in URL
    if (url.username || url.password) {
      return { valid: false, reason: 'Credentials in URL not allowed' }
    }

    return { valid: true }
  } catch {
    return { valid: false, reason: 'Invalid URL format' }
  }
}

/**
 * Sanitize and validate a URL, throwing if invalid
 */
export function sanitizeUrl(rawUrl: string): string {
  const result = validateUrl(rawUrl)
  if (!result.valid) {
    throw new Error(`SSRF block: ${result.reason}`)
  }
  return rawUrl
}
