import Link from 'next/link'

export const metadata = {
  title: 'Página no encontrada',
}

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '520px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--terra)',
            margin: '0 0 12px 0',
          }}
        >
          Error 404
        </p>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '34px',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--texto)',
            margin: '0 0 14px 0',
            lineHeight: 1.2,
          }}
        >
          No encontramos esta página
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--texto-mid)',
            lineHeight: 1.7,
            margin: '0 0 2rem 0',
          }}
        >
          Es posible que el terreno ya no esté disponible o que el enlace haya
          cambiado. Vuelve al catálogo o escríbenos para ayudarte.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/terrenos"
            style={{
              background: 'var(--terra)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
              padding: '11px 22px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            Ver terrenos
          </Link>
          <Link
            href="/"
            style={{
              background: '#fff',
              color: 'var(--texto)',
              border: '1px solid var(--borde)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '11px 22px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
