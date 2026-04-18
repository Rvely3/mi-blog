import Link from 'next/link'

/**
 * Footer global.
 * - Marca: Terrenosentrujillo.pe
 * - Columnas: descripción + navegar + info legal
 *
 * Los valores de contacto (WhatsApp, email) se consumirán desde
 * `siteSettings` en Sanity cuando ese componente se conecte. Por ahora
 * se enlazan solo como rutas internas (/contacto).
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--texto)',
        color: '#F5EDE4',
        padding: '3rem 2.5rem 1.5rem',
        fontFamily: 'var(--font-geist-sans)',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .footer-top {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
        }
      `}</style>

      <div
        style={{ maxWidth: '1120px', margin: '0 auto' }}
      >
        {/* Fila superior: 3 columnas */}
        <div
          className="footer-top"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Columna 1: Marca + descripción */}
          <div>
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: 500,
                color: '#F5EDE4',
                margin: '0 0 4px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Terrenosentrujillo.pe
            </p>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: 'var(--terra)',
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
              }}
            >
              Trujillo · La Libertad
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(245,237,228,0.65)',
                lineHeight: 1.7,
                margin: 0,
                maxWidth: '280px',
              }}
            >
              Terrenos en venta en Trujillo. Fichas con precio, área y ubicación;
              contacto directo por WhatsApp con el corredor.
            </p>
          </div>

          {/* Columna 2: Navegar */}
          <div>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(245,237,228,0.4)',
                margin: '0 0 14px 0',
              }}
            >
              Navegar
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Terrenos', href: '/terrenos' },
                { label: 'Cómo funciona', href: '/como-funciona' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: '14px',
                      color: 'rgba(245,237,228,0.75)',
                      textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Información */}
          <div>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(245,237,228,0.4)',
                margin: '0 0 14px 0',
              }}
            >
              Información
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {[
                { label: 'Sobre nosotros', href: '/sobre-nosotros' },
                { label: 'Políticas de privacidad', href: '/privacidad' },
                { label: 'Aviso legal', href: '/aviso-legal' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: '14px',
                      color: 'rgba(245,237,228,0.75)',
                      textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fila inferior: copyright + legal corto */}
        <div
          className="footer-bottom"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <p style={{ fontSize: '12px', color: 'rgba(245,237,228,0.4)', margin: 0 }}>
            © {year} Terrenosentrujillo.pe · Hecho desde Trujillo.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(245,237,228,0.35)', margin: 0 }}>
            Corretaje inmobiliario · La Libertad, Perú
          </p>
        </div>
      </div>
    </footer>
  )
}
