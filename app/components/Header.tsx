import Link from 'next/link'
import type { SiteSettings } from '@/sanity/types'
import { whatsappUrl } from '@/lib/whatsapp'

interface Props {
  settings?: SiteSettings | null
}

/**
 * Header global del sitio.
 * - Marca: Terrenosentrujillo.pe
 * - Enlaces: Terrenos, Cómo funciona, Blog + CTA
 *
 * Si hay WhatsApp configurado en siteSettings, el CTA "Escríbenos" apunta
 * directo a wa.me; si no, cae a `/contacto` (placeholder para fase 4).
 */
export default function Header({ settings }: Props) {
  const brand = settings?.siteName || 'Terrenosentrujillo.pe'
  const tagline = settings?.tagline || 'Trujillo · La Libertad'

  const waHref = whatsappUrl(settings?.whatsapp, settings?.whatsappDefaultMessage)
  const ctaHref = waHref || '/contacto'
  const ctaExternal = Boolean(waHref)

  return (
    <header
      style={{
        width: '100%',
        background: '#fff',
        borderTop: '3px solid var(--terra)',
        borderBottom: '0.5px solid var(--borde)',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .header-nav-links { display: none !important; }
          .header-inner { padding: 0 1.25rem !important; }
        }
      `}</style>

      <div
        className="header-inner"
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div
            style={{
              fontSize: '17px',
              fontWeight: 500,
              color: 'var(--texto)',
              letterSpacing: '0.01em',
            }}
          >
            {brand}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--terra)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: '2px',
            }}
          >
            {tagline}
          </div>
        </Link>

        {/* Navegación */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div
            className="header-nav-links"
            style={{ display: 'flex', alignItems: 'center', gap: '28px' }}
          >
            <Link
              href="/terrenos"
              style={{ fontSize: '13px', color: 'var(--texto-mid)', textDecoration: 'none' }}
            >
              Terrenos
            </Link>
            <Link
              href="/como-funciona"
              style={{ fontSize: '13px', color: 'var(--texto-mid)', textDecoration: 'none' }}
            >
              Cómo funciona
            </Link>
            <Link
              href="/blog"
              style={{ fontSize: '13px', color: 'var(--texto-mid)', textDecoration: 'none' }}
            >
              Blog
            </Link>
          </div>
          {ctaExternal ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#fff',
                background: 'var(--terra)',
                padding: '8px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Escríbenos
            </a>
          ) : (
            <Link
              href={ctaHref}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#fff',
                background: 'var(--terra)',
                padding: '8px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Escríbenos
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
