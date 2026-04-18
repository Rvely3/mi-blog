import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
  /**
   * Si se pasa, se usa como base absoluta para el JSON-LD.
   * Si no, se omite el structured data (útil cuando no conocemos el origen).
   */
  siteUrl?: string
}

/**
 * Migas de pan con JSON-LD BreadcrumbList opcional.
 * El último item se renderiza como texto (página actual).
 *
 * Uso típico:
 *   <Breadcrumbs items={[
 *     { label: 'Inicio', href: '/' },
 *     { label: 'Terrenos', href: '/terrenos' },
 *     { label: 'Lote en Huanchaco' },
 *   ]} siteUrl="https://terrenosentrujillo.pe" />
 */
export default function Breadcrumbs({ items, siteUrl }: Props) {
  if (!items?.length) return null

  const jsonLd = siteUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.label,
          ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
        })),
      }
    : null

  return (
    <>
      <nav
        aria-label="Migas de pan"
        style={{
          fontSize: '12px',
          color: 'var(--texto-soft)',
          letterSpacing: '0.02em',
          marginBottom: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <span
              key={`${item.label}-${i}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  style={{
                    color: 'var(--terra)',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  style={{
                    color: isLast ? 'var(--texto-mid)' : 'var(--texto-soft)',
                    fontWeight: isLast ? 500 : 400,
                  }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span style={{ color: 'var(--borde)' }} aria-hidden="true">
                  ›
                </span>
              )}
            </span>
          )
        })}
      </nav>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  )
}
