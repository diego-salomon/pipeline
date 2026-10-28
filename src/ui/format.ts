/** All number/date formatting flows through the brand locale + currency. */

import { brand } from '../config/brand.config'

const money = new Intl.NumberFormat(brand.locale, {
  style: 'currency',
  currency: brand.currency,
  maximumFractionDigits: 0,
})

const dateFmt = new Intl.DateTimeFormat(brand.locale, { dateStyle: 'medium' })
const dateTimeFmt = new Intl.DateTimeFormat(brand.locale, { dateStyle: 'medium', timeStyle: 'short' })
const relFmt = new Intl.RelativeTimeFormat(brand.locale, { numeric: 'auto' })

export function formatMoney(value: number): string {
  return money.format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(brand.locale).format(value)
}

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso))
}

export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso))
}

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

/** "hace 3 días" style relative time, from now. */
export function formatRelative(iso: string, now: Date = new Date()): string {
  let duration = (new Date(iso).getTime() - now.getTime()) / 1000
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relFmt.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }
  return formatDate(iso)
}
