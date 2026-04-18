import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Cómo funciona',
  description:
    'Así trabajamos: publicamos terrenos con información verificada, coordinamos visita por WhatsApp y te acompañamos hasta la firma notarial.',
  alternates: { canonical: '/como-funciona' },
}

const STEPS = [
  {
    n: '01',
    title: 'Publicamos con información verificada',
    body: 'Cada ficha muestra precio, área, distrito y fotos reales. Antes de listar, confirmamos con el propietario la titularidad y el estado legal del terreno (minuta, título de propiedad, libre de cargas).',
  },
  {
    n: '02',
    title: 'Coordinamos la visita',
    body: 'Cuando algo te interesa, nos escribes por WhatsApp y agendamos una visita al terreno contigo. Te acompañamos en el lugar para que lo veas en persona y aclaremos cualquier duda.',
  },
  {
    n: '03',
    title: 'Acompañamos el cierre',
    body: 'Si decides avanzar, coordinamos con el propietario la reserva, la minuta, la firma en notaría y la inscripción en SUNARP. No tienes que manejar varios contactos: nosotros los consolidamos.',
  },
]

const FAQ = [
  {
    q: '¿Cobran comisión al comprador?',
    a: 'Nuestra comisión la cubre el propietario, salvo acuerdo distinto que te informamos desde la primera conversación. No hay sorpresas al cierre.',
  },
  {
    q: '¿Los terrenos están saneados?',
    a: 'Listamos únicamente terrenos con documentación vigente. Te mostramos partida registral y, cuando corresponda, el plano. Si un terreno tiene observaciones, lo indicamos en la ficha.',
  },
  {
    q: '¿Puedo visitar antes de decidir?',
    a: 'Sí, sin compromiso. Coordinamos día y hora, y te acompañamos. Recomendamos visitar siempre antes de cualquier adelanto.',
  },
  {
    q: '¿Trabajan con crédito hipotecario?',
    a: 'La mayoría de nuestros terrenos son aptos para financiamiento bancario. Si necesitas crédito, podemos orientarte sobre los requisitos habituales en Perú.',
  },
]

export default async function ComoFuncionaPage() {
  const settings = await getSiteSettings()
  const siteUrl = getSiteUrl()
  const waHref = whatsappUrl(
    settings?.whatsapp,
    settings?.whatsappDefaultMessage,
  )

  // FAQPage JSON-LD para SEO
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

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
            { label: 'Cómo funciona' },
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
            Proceso
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
            Cómo funciona
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--texto-mid)',
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Comprar un terreno en Trujillo debería ser claro y sin intermediarios
            que desinforman. Así trabajamos.
          </p>
        </header>

        {/* Pasos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {STEPS.map((step) => (
            <div
              key={step.n}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr',
                gap: '1.25rem',
                padding: '1.5rem',
                border: '1px solid var(--borde)',
                borderRadius: '14px',
                background: '#fff',
              }}
            >
              <p
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '32px',
                  color: 'var(--terra)',
                  margin: 0,
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                }}
              >
                {step.n}
              </p>
              <div>
                <h2
                  style={{
                    fontSize: '17px',
                    fontWeight: 500,
                    color: 'var(--texto)',
                    margin: '0 0 6px 0',
                    lineHeight: 1.35,
                  }}
                >
                  {step.title}
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--texto-mid)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <section style={{ marginTop: '3.5rem' }}>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: 'var(--texto)',
              margin: '0 0 1.25rem 0',
            }}
          >
            Preguntas frecuentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQ.map((item) => (
              <details
                key={item.q}
                style={{
                  border: '1px solid var(--borde)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  background: '#fff',
                }}
              >
                <summary
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'var(--texto)',
                    cursor: 'pointer',
                    listStyle: 'none',
                  }}
                >
                  {item.q}
                </summary>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--texto-mid)',
                    lineHeight: 1.7,
                    margin: '10px 0 0 0',
                  }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div
          style={{
            marginTop: '3rem',
            padding: '2rem 1.5rem',
            background: 'var(--fondo)',
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
            ¿Tienes dudas antes de empezar?
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
            Escríbenos por WhatsApp o déjanos un mensaje. Sin compromiso.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '11px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Escribir por WhatsApp
              </a>
            ) : null}
            <Link
              href="/contacto"
              style={{
                background: waHref ? '#fff' : 'var(--terra)',
                color: waHref ? 'var(--texto)' : '#fff',
                border: waHref ? '1px solid var(--borde)' : 'none',
                fontSize: '13px',
                fontWeight: 500,
                padding: '11px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Enviar mensaje
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  )
}
