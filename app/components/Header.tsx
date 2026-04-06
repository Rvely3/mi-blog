import Link from 'next/link'

export default function Header() {
  return (
    <header style={{
      width: '100%',
      background: '#fff',
      borderTop: '3px solid var(--terra)',
      borderBottom: '0.5px solid var(--borde)',
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '17px', fontWeight: 500, color: 'var(--texto)', letterSpacing: '0.01em' }}>
            Tierra Viva
          </div>
          <div style={{ fontSize: '10px', color: 'var(--terra)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '2px' }}>
            Trujillo · La Libertad
          </div>
        </Link>

        {/* Navegación */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--texto-mid)', textDecoration: 'none' }}>
            Inicio
          </Link>
          <Link href="/terrenos" style={{ fontSize: '13px', color: 'var(--texto-mid)', textDecoration: 'none' }}>
            Terrenos
          </Link>
          <Link href="/como-funciona" style={{ fontSize: '13px', color: 'var(--texto-mid)', textDecoration: 'none' }}>
            Cómo funciona
          </Link>
          <Link
            href="/contacto"
            style={{
              fontSize: '12px', fontWeight: 500,
              color: '#fff', background: 'var(--terra)',
              padding: '8px 18px', borderRadius: '8px',
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