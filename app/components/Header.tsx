import Link from 'next/link'

/**
 * Header global del sitio.
 * - Marca: Terrenosentrujillo.pe
 * - Enlaces: Inicio, Terrenos, Cómo funciona, Blog, Contacto (CTA)
 *
 * Nota: el menú móvil completo llegará en una fase posterior; por ahora
 * en <768px se ocultan los links y queda visible el CTA "Escríbenos".
 */
export default function Header() {
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
            Terrenosentrujillo.pe
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
            Trujillo · La Libertad
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
          <Link
            href="/contacto"
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
        </nav>
      </div>
    </header>
  )
}
