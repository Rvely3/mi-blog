import type { Currency, TerrenoStatus, TerrenoType } from '@/sanity/types'

/**
 * Formatea un precio en PEN o USD para mostrar en UI.
 * Si no hay precio o `priceOnRequest` está activo, devuelve "Consultar".
 */
export function formatPrice(
  price?: number | null,
  currency: Currency = 'USD',
  priceOnRequest?: boolean,
): string {
  if (priceOnRequest || !price) return 'Consultar'

  const symbol = currency === 'PEN' ? 'S/' : 'US$'
  const formatted = new Intl.NumberFormat('es-PE', {
    maximumFractionDigits: 0,
  }).format(price)

  return `${symbol} ${formatted}`
}

/**
 * Formatea un área en m² con separador de miles.
 */
export function formatArea(area?: number | null): string {
  if (!area && area !== 0) return '—'
  return `${new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(area)} m²`
}

/**
 * Precio por m² calculado. Devuelve null si no hay suficiente información.
 */
export function pricePerSqm(
  price?: number | null,
  area?: number | null,
  currency: Currency = 'USD',
): string | null {
  if (!price || !area || area <= 0) return null
  return `${formatPrice(price / area, currency)}/m²`
}

/**
 * Fecha localizada en es-PE. Entrada ISO, salida "18 de abril de 2026".
 */
export function formatDateLong(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Fecha corta es-PE: "18 abr".
 */
export function formatDateShort(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
}

// ── Labels legibles para enums ──

const STATUS_LABELS: Record<TerrenoStatus, string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
}

const TYPE_LABELS: Record<TerrenoType, string> = {
  urbano: 'Urbano',
  playa: 'Playa',
  rural: 'Rural',
  agricola: 'Agrícola',
  comercial: 'Comercial',
}

export function statusLabel(status: TerrenoStatus): string {
  return STATUS_LABELS[status] ?? status
}

export function typeLabel(type: TerrenoType): string {
  return TYPE_LABELS[type] ?? type
}

/**
 * Color del token de diseño según el estado del terreno.
 * Usado en badges de estado.
 */
export function statusTone(status: TerrenoStatus): {
  bg: string
  fg: string
} {
  switch (status) {
    case 'disponible':
      return { bg: 'var(--olivo-light)', fg: 'var(--olivo)' }
    case 'reservado':
      return { bg: 'var(--ocre-light)', fg: 'var(--ocre)' }
    case 'vendido':
      return { bg: '#F3E8E0', fg: '#7A3D1D' }
    default:
      return { bg: 'var(--borde)', fg: 'var(--texto-mid)' }
  }
}
