'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { EV_SPECS, type EVSpec } from '@/lib/ev-specs'
import styles from './ComparisonTool.module.css'

const MAX_COMPARE = 4

interface SpecRow {
  key: string
  label: string
  format: (ev: EVSpec) => string
  numeric: (ev: EVSpec) => number
  unit: string
  lowerBetter?: boolean
}

const SPEC_ROWS: SpecRow[] = [
  { key: 'range', label: 'Reichweite (WLTP)', format: (ev) => `${ev.range_km} km`, numeric: (ev) => ev.range_km, unit: 'km' },
  { key: 'price', label: 'Preis (EUR)', format: (ev) => `${ev.price_eur_est.toLocaleString('de-DE')} €`, numeric: (ev) => ev.price_eur_est, unit: '€' },
  { key: 'battery', label: 'Batterie', format: (ev) => `${ev.battery_kwh} kWh`, numeric: (ev) => ev.battery_kwh, unit: 'kWh' },
  { key: 'fastCharge', label: 'DC-Laden', format: (ev) => `${ev.fast_charge_kw} kW`, numeric: (ev) => ev.fast_charge_kw, unit: 'kW' },
  { key: 'accel', label: '0-100 km/h', format: (ev) => `${ev.zero_to_100_sec}s`, numeric: (ev) => ev.zero_to_100_sec, unit: 's', lowerBetter: true },
  { key: 'topSpeed', label: 'Höchstgeschw.', format: (ev) => `${ev.top_speed_kmh} km/h`, numeric: (ev) => ev.top_speed_kmh, unit: 'km/h' },
  { key: 'power', label: 'Leistung', format: (ev) => `${ev.motor_power_kw} kW`, numeric: (ev) => ev.motor_power_kw, unit: 'kW' },
  { key: 'drivetrain', label: 'Antrieb', format: (ev) => formatDrivetrain(ev.drivetrain), numeric: () => 0, unit: '' },
  { key: 'seats', label: 'Länge', format: (ev) => `${(ev.length_mm / 1000).toFixed(1)} m`, numeric: (ev) => ev.length_mm, unit: 'mm' },
  { key: 'weight', label: 'Leergewicht', format: (ev) => `${ev.curb_weight_kg} kg`, numeric: (ev) => ev.curb_weight_kg, unit: 'kg' },
]

function formatDrivetrain(dt: string): string {
  const map: Record<string, string> = { FWD: 'Frontantrieb', RWD: 'Heckantrieb', AWD: 'Allrad' }
  return map[dt] || dt
}

export default function ComparisonTool() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selected, setSelected] = useState<EVSpec[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSlot, setActiveSlot] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load from URL params
  useEffect(() => {
    const evsParam = searchParams.get('evs')
    if (evsParam) {
      const ids = evsParam.split(',').slice(0, MAX_COMPARE)
      const evs = ids
        .map((id) => EV_SPECS.find((ev) => ev.model.toLowerCase().replace(/\s+/g, '-') === id))
        .filter(Boolean) as EVSpec[]
      setSelected(evs)
    }
  }, [searchParams])

  // Update URL when selection changes
  const updateUrl = useCallback((evs: EVSpec[]) => {
    const params = new URLSearchParams()
    if (evs.length > 0) {
      params.set('evs', evs.map((ev) => ev.model.toLowerCase().replace(/\s+/g, '-')).join(','))
    }
    router.replace(`/vergleich?${params.toString()}`, { scroll: false })
  }, [router])

  const addEv = (ev: EVSpec) => {
    if (selected.length >= MAX_COMPARE) return
    if (selected.some((s) => s.model === ev.model)) return
    const newSelected = [...selected, ev]
    setSelected(newSelected)
    updateUrl(newSelected)
    setDropdownOpen(false)
    setSearchQuery('')
    setActiveSlot(null)
  }

  const removeEv = (index: number) => {
    const newSelected = selected.filter((_, i) => i !== index)
    setSelected(newSelected)
    updateUrl(newSelected)
  }

  const openDropdown = (slotIndex: number) => {
    setActiveSlot(slotIndex)
    setDropdownOpen(true)
    setSearchQuery('')
  }

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setActiveSlot(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredEvs = EV_SPECS.filter((ev) => {
    const query = searchQuery.toLowerCase()
    return (
      ev.model.toLowerCase().includes(query) ||
      ev.brand.toLowerCase().includes(query)
    )
  }).filter((ev) => !selected.some((s) => s.model === ev.model))

  return (
    <div className={styles.tool} role="region" aria-label="EV-Vergleich">
      {/* EV Slots */}
      <div className={styles.slots}>
        {Array.from({ length: MAX_COMPARE }).map((_, i) => {
          const ev = selected[i]
          return (
            <div key={i} className={`${styles.slot} ${ev ? styles.slotFilled : styles.slotEmpty}`}>
              {ev ? (
                <>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeEv(i)}
                    aria-label={`${ev.brand} ${ev.model} entfernen`}
                  >
                    ×
                  </button>
                  <p className={styles.slotBrand}>{ev.brand}</p>
                  <p className={styles.slotModel}>{ev.model}</p>
                  <p className={styles.slotPrice}>{ev.price_eur_est.toLocaleString('de-DE')} €</p>
                </>
              ) : (
                <button
                  className={styles.addBtn}
                  onClick={() => openDropdown(i)}
                >
                  <span className={styles.addIcon}>+</span>
                  <span>E-Auto hinzufügen</span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className={styles.dropdownOverlay}>
          <div className={styles.dropdown} ref={dropdownRef}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Marke oder Modell suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <ul className={styles.dropdownList}>
              {filteredEvs.length === 0 ? (
                <li className={styles.dropdownEmpty}>Keine Ergebnisse</li>
              ) : (
                filteredEvs.map((ev) => (
                  <li key={ev.model}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => addEv(ev)}
                    >
                      <span className={styles.dropdownBrand}>{ev.brand}</span>
                      <span className={styles.dropdownModel}>{ev.model}</span>
                      <span className={styles.dropdownPrice}>{ev.price_eur_est.toLocaleString('de-DE')} €</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {selected.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.specHeader}>Spezifikation</th>
                {selected.map((ev) => (
                  <th key={ev.model} className={styles.evHeader}>
                    {ev.brand} {ev.model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((spec) => {
                const values = selected.map((ev) => spec.numeric(ev))
                const maxVal = Math.max(...values.filter((v) => v > 0))
                const minVal = spec.lowerBetter
                  ? Math.min(...values.filter((v) => v > 0))
                  : null

                return (
                  <tr key={spec.key}>
                    <td className={styles.specLabel}>{spec.label}</td>
                    {selected.map((ev, i) => {
                      const val = spec.numeric(ev)
                      const isBest = spec.lowerBetter
                        ? val === minVal && val > 0
                        : val === maxVal && val > 0
                      const barWidth = maxVal > 0 ? (val / maxVal) * 100 : 0

                      return (
                        <td key={ev.model} className={`${styles.specValue} ${isBest ? styles.specWinner : ''}`}>
                          <div className={styles.specValueInner}>
                            <span>{spec.format(ev)}</span>
                            {val > 0 && spec.unit !== '' && (
                              <div className={styles.barWrapper}>
                                <div
                                  className={styles.bar}
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {selected.length === 0 && !dropdownOpen && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Füge ein E-Auto hinzu, um zu vergleichen</p>
          <div className={styles.suggestions}>
            <p className={styles.suggestionsLabel}>Beliebte Vergleiche:</p>
            <div className={styles.suggestionBtns}>
              <button onClick={() => { setSelected([EV_SPECS[0], EV_SPECS[4]]); updateUrl([EV_SPECS[0], EV_SPECS[4]]) }} className={styles.suggestionBtn}>
                BYD Seal vs Xiaomi SU7
              </button>
              <button onClick={() => { setSelected([EV_SPECS[0], EV_SPECS[7]]); updateUrl([EV_SPECS[0], EV_SPECS[7]]) }} className={styles.suggestionBtn}>
                BYD Seal vs XPeng P7
              </button>
              <button onClick={() => { setSelected([EV_SPECS[0], EV_SPECS[4], EV_SPECS[10]]); updateUrl([EV_SPECS[0], EV_SPECS[4], EV_SPECS[10]]) }} className={styles.suggestionBtn}>
                BYD Seal vs Xiaomi SU7 vs Zeekr 001
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
