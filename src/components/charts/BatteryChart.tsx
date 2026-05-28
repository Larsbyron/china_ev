'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { EV_SPECS } from '@/lib/ev-specs'
import styles from './Charts.module.css'

export default function BatteryChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!mounted) {
    return <div className={styles.skeleton} />
  }

  const data = EV_SPECS
    .map((ev) => ({
      name: `${ev.brand} ${ev.model}`.length > 18
        ? `${ev.brand} ${ev.model.slice(0, 8)}...`
        : `${ev.brand} ${ev.model}`,
      battery: ev.battery_kwh,
      fastCharge: ev.fast_charge_kw,
    }))
    .sort((a, b) => b.battery - a.battery)

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#8b94ad', fontSize: 11 }}
            axisLine={{ stroke: '#1e2747' }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#8b94ad', fontSize: 12 }}
            axisLine={{ stroke: '#1e2747' }}
            tickLine={false}
            unit=" kWh"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#8b94ad', fontSize: 12 }}
            axisLine={{ stroke: '#1e2747' }}
            tickLine={false}
            unit=" kW"
          />
          <Tooltip
            contentStyle={{
              background: '#18203f',
              border: '1px solid #1e2747',
              borderRadius: 8,
              color: '#f5f7fa',
              fontSize: 13,
            }}
            formatter={(value, name) => {
              const num = Number(value)
              if (name === 'Batterie') return [`${num} kWh`, name]
              return [`${num} kW`, 'DC-Laden']
            }}
          />
          <Legend
            wrapperStyle={{ color: '#8b94ad', fontSize: 12 }}
          />
          <Bar yAxisId="left" dataKey="battery" name="Batterie" fill="#19b8cf" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="fastCharge" name="DC-Laden" fill="#ff9f0a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
