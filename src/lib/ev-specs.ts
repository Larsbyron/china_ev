import { z } from 'zod'
import evSpecsData from '@/data/ev-specs.json'

// EV specs schema — single source of truth for comparison tool, charts, Quick Facts
export const evSpecSchema = z.object({
  model: z.string(),
  brand: z.string(),
  year: z.number().int(),
  battery_kwh: z.number(),
  range_km: z.number().int(),
  fast_charge_kw: z.number().int(),
  zero_to_100_sec: z.number(),
  top_speed_kmh: z.number().int(),
  price_cny: z.number().int(),
  price_eur_est: z.number().int(),
  length_mm: z.number().int(),
  width_mm: z.number().int(),
  height_mm: z.number().int(),
  wheelbase_mm: z.number().int(),
  curb_weight_kg: z.number().int(),
  drivetrain: z.enum(['FWD', 'RWD', 'AWD']),
  motor_power_kw: z.number().int(),
  motor_torque_nm: z.number().int(),
  cargo_liters: z.number().int().optional(),
  screen_inches: z.number().optional(),
  adas_level: z.number().int().min(0).max(5).optional(),
  tags: z.array(z.string()),
})

export const evSpecsSchema = z.array(evSpecSchema)

export type EVSpec = z.infer<typeof evSpecSchema>

const parsed = evSpecsSchema.safeParse(evSpecsData)
if (!parsed.success) {
  console.error('Invalid ev-specs.json:', parsed.error.format())
}

export const EV_SPECS: EVSpec[] = parsed.success ? parsed.data : []

export function getEVSpecByModel(model: string): EVSpec | undefined {
  return EV_SPECS.find((s) => s.model === model)
}

export function getEVSpecsByBrand(brand: string): EVSpec[] {
  return EV_SPECS.filter((s) => s.brand === brand)
}

export function getEVSpecsByTag(tag: string): EVSpec[] {
  return EV_SPECS.filter((s) => s.tags.includes(tag))
}
