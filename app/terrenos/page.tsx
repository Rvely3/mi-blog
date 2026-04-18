import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { terrenosListQuery } from '@/sanity/lib/queries'
import type { DistritoSummary, TerrenoSummary } from '@/sanity/types'
import TerrenoCard from '@/app/components/TerrenoCard'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import { getSiteUrl } from '@/lib/siteSettings'

const PAGE_SIZE = 12

interface ListResult {
  items: TerrenoSummary[]
  total: number
  distritos: DistritoSummary[]
}

function parsePage(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
}

function parseDistrito(raw: string | string[] | undefined): string | undefined {
  const v = Array.isArray(raw) ? raw[0] : raw
  return v && v.length > 0 ? v : undefined
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const sp = await searchParams
  const distritoSlug = parseDistrito(sp.distrito)
  const page = parsePage(sp.page)

  const baseTitle = distritoSlug
    ? `Terrenos en ${titleCase(distritoSlug)}`
    : 'Terrenos en venta en Trujillo'
  const title = page > 1 ? `${baseTitle} · Página ${page}` : baseTitle

  const description = distritoSlug
    ? `Catálogo de terrenos en ${titleCase(
        distritoSlug,
      )}, Trujillo. Precios, área y ubicación; contacto directo por WhatsApp.`
    : 'Listado de terrenos en venta en Trujillo y La Libertad. Filtros por distrito, precios y áreas. Contacto directo con el corredor.'

  const path = distritoSlug
    ? `/terrenos?distrito=${encodeURIComponent(distritoSlug)}${page > 1 ? `&page=${page}` : ''}`
    : page > 1
      ? `/terrenos?page=${page}`
      : '/terrenos'

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${getSiteUrl()}${path}`,
      type: 'website',
    },
  }
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default async function TerrenosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const distritoSlug = parseDistrito(sp.distrito)
  const page = parsePage(sp.page)
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const data = await client.fetch<ListResult>(terrenosListQuery, {
    distritoSlug: distritoSlug ?? null,
    start,
    end,
  })

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const items = data?.items ?? []
  const distritos = data?.distritos ?? []

  const currentDistrito = distritoSlug
    ? distritos.find((d) => d.slug === distritoSlug)
    : undefined

  const buildHref = (slug?: string, p: number = 1) => {
    const params = new URLSearchParams()
    if (slug) params.set('distrito', slug)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/terrenos?${qs}` : '/terrenos'
  }

  return (
    <div style={{ background: '#fff' }}>
      <section
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 5rem',
        }}
      >
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Terrenos', href: '/terrenos' },
            ...(currentDistrito ? [{ label: currentDistrito.name }] : []),
          ]}
          siteUrl={getSiteUrl()}
        />

        <header style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '32px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--texto)',
              margin: '0 0 8px 0',
            }}
          >
            {currentDistrito
              ? `Terrenos en ${currentDistrito.name}`
              : 'Terrenos en venta en Trujillo'}
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--texto-mid)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '640px',
            }}
          >
            {currentDistrito?.shortDescription ||
              'Catálogo actualizado con precio, área y ubicación. Contacto directo por WhatsApp con el corredor.'}
          </p>
        </header>

        {/* Chips filtro distrito */}
        {distritos.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '2rem',
            }}
          >
            <FilterChip label="Todos" href={buildHref()} active={!distritoSlug} />
            {distritos.map((d) => (
              <FilterChip
                key={d._id}
                label={d.name}
                href={buildHref(d.slug)}
                active={d.slug === distritoSlug}
              />
            ))}
          </div>
        )}

        {/* Resultados */}
        {items.length === 0 ? (
          <div
            style={{
              border: '1px dashed var(--borde)',
              borderRadius: '12px',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: 'var(--texto-soft)',
            }}
          >
            <p style={{ fontSize: '14px', margin: '0 0 12px 0' }}>
              Todavía no hay terrenos publicados
              {currentDistrito ? ` en ${currentDistrito.name}` : ''}.
            </p>
            <p style={{ fontSize: '13px', margin: 0 }}>
              Puedes escribirnos por WhatsApp para avisarte cuando aparezcan.
            </p>
          </div>
        ) : (
          <>
            <TerrenosGrid items={items} />

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                buildHref={(p) => buildHref(distritoSlug, p)}
              />
            )}

            <p
              style={{
                marginTop: '1.5rem',
                fontSize: '12px',
                color: 'var(--texto-soft)',
              }}
            >
              {total} {total === 1 ? 'terreno' : 'terrenos'}
              {currentDistrito ? ` en ${currentDistrito.name}` : ''}.
            </p>
          </>
        )}
      </section>
    </div>
  )
}

// ── Sub-componentes locales ──

function FilterChip({
  label,
  href,
  active,
}: {
  label: string
  href: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-block',
        fontSize: '12px',
        padding: '7px 14px',
        borderRadius: '999px',
        textDecoration: 'none',
        border: '1px solid',
        borderColor: active ? 'var(--terra)' : 'var(--borde)',
        background: active ? 'var(--terra)' : '#fff',
        color: active ? '#fff' : 'var(--texto-mid)',
        fontWeight: active ? 500 : 400,
        letterSpacing: '0.01em',
      }}
    >
      {label}
    </Link>
  )
}

function TerrenosGrid({ items }: { items: TerrenoSummary[] }) {
  return (
    <>
      <style>{`
        .terrenos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .terrenos-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .terrenos-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="terrenos-grid">
        {items.map((t, i) => (
          <TerrenoCard key={t._id} terreno={t} priority={i < 3} />
        ))}
      </div>
    </>
  )
}

function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number
  totalPages: number
  buildHref: (p: number) => string
}) {
  const prev = page > 1 ? page - 1 : null
  const next = page < totalPages ? page + 1 : null

  return (
    <nav
      aria-label="Paginación"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '2.5rem',
      }}
    >
      {prev !== null ? (
        <Link
          href={buildHref(prev)}
          style={pagerButtonStyle(false)}
          aria-label="Página anterior"
        >
          ← Anterior
        </Link>
      ) : (
        <span style={{ ...pagerButtonStyle(false), opacity: 0.4, pointerEvents: 'none' }}>
          ← Anterior
        </span>
      )}
      <span style={{ fontSize: '12px', color: 'var(--texto-soft)', padding: '0 8px' }}>
        Página {page} de {totalPages}
      </span>
      {next !== null ? (
        <Link
          href={buildHref(next)}
          style={pagerButtonStyle(false)}
          aria-label="Página siguiente"
        >
          Siguiente →
        </Link>
      ) : (
        <span style={{ ...pagerButtonStyle(false), opacity: 0.4, pointerEvents: 'none' }}>
          Siguiente →
        </span>
      )}
    </nav>
  )
}

function pagerButtonStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: '12px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid var(--borde)',
    background: active ? 'var(--terra)' : '#fff',
    color: active ? '#fff' : 'var(--texto-mid)',
    textDecoration: 'none',
    fontWeight: 500,
  }
}
