import { getEVSpecByModel } from '@/lib/ev-specs'
import styles from './QuickFacts.module.css'

interface QuickFactsProps {
  evModel: string
}

export default function QuickFacts({ evModel }: QuickFactsProps) {
  const ev = getEVSpecByModel(evModel)

  if (!ev) return null

  const specs = [
    { label: 'Reichweite', value: `${ev.range_km} km` },
    { label: 'Batterie', value: `${ev.battery_kwh} kWh` },
    { label: 'Laden', value: ev.fast_charge_kw ? `${ev.fast_charge_kw} kW DC` : null },
    { label: 'Preis', value: ev.price_eur_est ? `ab ${ev.price_eur_est.toLocaleString('de-DE')} €` : null },
    { label: '0-100 km/h', value: ev.zero_to_100_sec ? `${ev.zero_to_100_sec}s` : null },
    { label: 'Leistung', value: ev.motor_power_kw ? `${ev.motor_power_kw} kW` : null },
    { label: 'Antrieb', value: formatDrivetrain(ev.drivetrain) },
    { label: 'Höchstgeschw.', value: `${ev.top_speed_kmh} km/h` },
    { label: 'Kofferraum', value: ev.cargo_liters ? `${ev.cargo_liters} L` : null },
  ]

  const filledSpecs = specs.filter((s) => s.value !== null)

  return (
    <aside className={styles.sidebar} role="complementary" aria-label="Schnellfakten">
      <h3 className={styles.heading}>Schnellfakten</h3>
      <p className={styles.model}>{ev.brand} {ev.model}</p>

      <dl className={styles.specList}>
        {filledSpecs.map((spec) => (
          <div key={spec.label} className={styles.specRow}>
            <dt className={styles.specLabel}>{spec.label}</dt>
            <dd className={styles.specValue}>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

function formatDrivetrain(dt: string): string {
  const map: Record<string, string> = { FWD: 'Frontantrieb', RWD: 'Heckantrieb', AWD: 'Allrad' }
  return map[dt] || dt
}
