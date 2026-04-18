import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description:
    'Somos un equipo local de corredores enfocados en terrenos en Trujillo. Trabajamos con información verificada, cero intermediarios y acompañamiento hasta la firma.',
  alternates: { canonical: '/sobre-nosotros' },
}

const VALORES = [
  {
    title: 'Información verificada',
    body:
      'Antes de publicar cualquier terreno, revisamos partida registral, linderos y situación legal con el propietario. Lo que ves en la ficha es lo que encontrarás en la visita.',
  },
  {
    title: 'Trato directo',
    body:
      'No trabajamos con cadenas de intermediarios. Hablas con el corredor que conoce el terreno y negocia con el propietario. Respuestas rápidas, sin juego de teléfono.',
  },
  {
    title: 'Enfoque local',
    body:
      'Operamos solo en Trujillo y alrededores. Conocemos los distritos, las zonas en crecimiento y los riesgos típicos (servidumbres, zonas de expansión, áreas intangibles).',
  },
  {
    title: 'Acompañamiento hasta el cierre',
    body:
      'Desde la visita hasta la inscripción en SUNARP. Coordinamos con el propietario, el notario y, si lo necesitas, con el banco para tu crédito hipotecario.',
  },
]

export default async function SobreNosotrosPage() {
  const settings = await getSiteSettings()
  const siteUrl = getSiteUrl()
  const waHref = whatsappUrl(
    settings?.whatsapp,
    settings?.whatsappDefaultMessage,
  )

  const companyName = settings?.legal?.companyName || settings?.siteName || 'Terrenos en Trujillo'

  return (
    <div style={{ background: '#fff' }}>
      <section
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '2rem 1.5rem 5rem',
        }}
      >
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Sobre nosotros' },
          ]}
          siteUrl={siteUrl}
        />

        <header style={{ marginBottom: '2.5rem' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--terra)',
              margin: '0 0 8px 0',
            }}
          >
            Nosotros
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '36px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--texto)',
              margin: '0 0 14px 0',
              lineHeight: 1.15,
            }}
          >
            Corredores locales, información verificada
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--texto-mid)',
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {companyName} nace con una idea simple: comprar un terreno en
            Trujillo no debería ser un laberinto de intermediarios, precios
            inflados y documentos que no coinciden. Nos enfocamos solo en esta
            ciudad y solo en terrenos — lo hacemos bien porque lo hacemos todos
            los días.
          </p>
        </header>

        {/* Valores */}
        <section style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '22px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: 'var(--texto)',
              margin: '0 0 1.25rem 0',
            }}
          >
            Cómo trabajamos
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
            }}
          >
            {VALORES.map((v) => (
              <div
                key={v.title}
                style={{
                  border: '1px solid var(--borde)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  background: '#fff',
                }}
              >
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'var(--texto)',
                    margin: '0 0 6px 0',
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--texto-mid)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Zona de operación */}
        <section
          style={{
            padding: '1.5rem',
            background: 'var(--fondo)',
            borderRadius: '14px',
            marginBottom: '3rem',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--texto-soft)',
              margin: '0 0 6px 0',
            }}
          >
            Zona de operación
          </p>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--texto)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Trujillo metropolitano y distritos aledaños: Víctor Larco Herrera,
            Huanchaco, Moche, Salaverry, Laredo, Poroto y alrededores de la
            región La Libertad.
          </p>
        </section>

        {/* CTA */}
        <div
          style={{
            padding: '2rem 1.5rem',
            border: '1px solid var(--borde)',
            borderRadius: '14px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '22px',
              fontWeight: 500,
              color: 'var(--texto)',
              margin: '0 0 8px 0',
            }}
          >
            ¿Buscas un terreno en Trujillo?
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--texto-mid)',
              margin: '0 auto 1.25rem',
              maxWidth: '480px',
              lineHeight: 1.6,
            }}
          >
            Revisa nuestro catálogo o escríbenos con lo que necesitas. Te
            respondemos en persona.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '10px',
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
                padding: '11px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Ver terrenos
            </Link>
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#fff',
                  color: 'var(--texto)',
                  border: '1px solid var(--borde)',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '11px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Escribir por WhatsApp
              </a>
            ) : (
              <Link
                href="/contacto"
                style={{
                  background: '#fff',
                  color: 'var(--texto)',
                  border: '1px solid var(--borde)',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '11px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Contactar
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
