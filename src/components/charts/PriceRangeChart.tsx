'use client'

import { useEffect, useState } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from 'recharts'
import { EV_SPECS } from '@/lib/ev-specs'
import styles from './Charts.module.css'

const BRAND_COLORS: Record<string, string> = {
  BYD: '#30d158',
  NIO: '#ff9f0a',
  XPeng: '#5e5ce6',
  Xiaomi: '#ff6b35',
  Zeekr: '#bf5af2',
  'Li Auto': '#64d2ff',
  MG: '#ffd60a',
  Geely: '#30b0c7',
}

export default function PriceRangeChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!mounted) {
    return <div className={styles.skeleton} />
  }

  const data = EV_SPECS.map((ev) => ({
    name: `${ev.brand} ${ev.model}`,
    price: ev.price_eur_est,
    range: ev.range_km,
    brand: ev.brand,
    battery: ev.battery_kwh,
  }))

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis
            type="number"
            dataKey="price"
            name="Preis"
            tick={{ fill: '#86868b', fontSize: 12 }}
            axisLine={{ stroke: '#2c2c2e' }}
            tickLine={false}
            unit=" €"
            label={{ value: 'Preis (EUR)', position: 'bottom', fill: '#86868b', fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="range"
            name="Reichweite"
            tick={{ fill: '#86868b', fontSize: 12 }}
            axisLine={{ stroke: '#2c2c2e' }}
            tickLine={false}
            unit=" km"
            label={{ value: 'Reichweite (km)', angle: -90, position: 'insideLeft', fill: '#86868b', fontSize: 12 }}
          />
          <ZAxis type="number" dataKey="battery" range={[60, 400]} />
          <Tooltip
            contentStyle={{
              background: '#1c1c1f',
              border: '1px solid #2c2c2e',
              borderRadius: 8,
              color: '#f5f5f7',
              fontSize: 13,
            }}
            formatter={(value, name) => {
              const num = Number(value)
              if (name === 'Preis') return [`${num.toLocaleString('de-DE')} €`, name]
              if (name === 'Reichweite') return [`${num} km`, name]
              return [`${num} kWh`, 'Batterie']
            }}
            labelFormatter={(label) => {
              const item = data.find((d) => d.price === Number(label))
              return item?.name || ''
            }}
          />
          <Scatter data={data} fill="#30d158">
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={BRAND_COLORS[entry.brand] || '#86868b'}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
