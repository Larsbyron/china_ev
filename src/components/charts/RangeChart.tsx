'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { EV_SPECS } from '@/lib/ev-specs'
import styles from './Charts.module.css'

export default function RangeChart() {
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
      name: `${ev.brand} ${ev.model}`,
      range: ev.range_km,
      brand: ev.brand,
    }))
    .sort((a, b) => b.range - a.range)

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
          <XAxis
            type="number"
            tick={{ fill: '#8b94ad', fontSize: 12 }}
            axisLine={{ stroke: '#1e2747' }}
            tickLine={false}
            unit=" km"
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#8b94ad', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip
            contentStyle={{
              background: '#18203f',
              border: '1px solid #1e2747',
              borderRadius: 8,
              color: '#f5f7fa',
              fontSize: 13,
            }}
            formatter={(value) => [`${value} km`, 'Reichweite']}
          />
          <Bar dataKey="range" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={index === 0 ? '#19b8cf' : index < 3 ? '#ff9f0a' : '#8b94ad'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
