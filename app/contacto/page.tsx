import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escríbenos por WhatsApp o email para información sobre terrenos en Trujillo. Respuesta directa del corredor.',
  alternates: { canonical: '/contacto' },
}

export default async function ContactoPage() {
  const settings = await getSiteSettings()
  const siteUrl = getSiteUrl()
  const waHref = whatsappUrl(
    settings?.whatsapp,
    settings?.whatsappDefaultMessage,
  )

  return (
    <div style={{ background: '#fff' }}>
      <section
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          padding: '2rem 1.5rem 5rem',
        }}
      >
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Contacto' },
          ]}
          siteUrl={siteUrl}
        />

        <header style={{ marginBottom: '2.5rem', maxWidth: '640px' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--terra)',
              margin: '0 0 8px 0',
            }}
          >
            Contacto
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '34px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--texto)',
              margin: '0 0 12px 0',
              lineHeight: 1.2,
            }}
          >
            Escríbenos
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--texto-mid)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Déjanos tu mensaje y te respondemos directo al correo o WhatsApp.
            Si prefieres más rápido, el botón de WhatsApp te lleva al chat.
          </p>
        </header>

        <style>{`
          .contact-grid {
            display: grid;
            grid-template-columns: 1.3fr 1fr;
            gap: 3rem;
            align-items: start;
          }
          @media (max-width: 820px) {
            .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          }
        `}</style>

        <div className="contact-grid">
          {/* Form */}
          <div>
            <ContactForm />
          </div>

          {/* Info de contacto */}
          <aside
            style={{
              border: '1px solid var(--borde)',
              borderRadius: '14px',
              padding: '1.5rem',
              background: 'var(--fondo)',
            }}
          >
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: 500,
                color: 'var(--texto)',
                margin: '0 0 1rem 0',
                letterSpacing: '-0.01em',
              }}
            >
              Otras formas de contactarnos
            </h2>

            {waHref ? (
              <ContactItem
                label="WhatsApp"
                value="Chat directo con el corredor"
                href={waHref}
                external
              />
            ) : (
              <ContactItem
                label="WhatsApp"
                value="Pronto disponible"
                muted
              />
            )}

            {settings?.email && (
              <ContactItem
                label="Email"
                value={settings.email}
                href={`mailto:${settings.email}`}
              />
            )}

            {settings?.phone && (
              <ContactItem
                label="Teléfono"
                value={settings.phone}
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              />
            )}

            {settings?.address && (
              <ContactItem label="Dirección" value={settings.address} />
            )}

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--borde)',
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
                  fontSize: '13px',
                  color: 'var(--texto-mid)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Trujillo y alrededores (La Libertad, Perú).
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

function ContactItem({
  label,
  value,
  href,
  external,
  muted,
}: {
  label: string
  value: string
  href?: string
  external?: boolean
  muted?: boolean
}) {
  const labelEl = (
    <p
      style={{
        fontSize: '11px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--texto-soft)',
        margin: '0 0 4px 0',
      }}
    >
      {label}
    </p>
  )
  const valueStyle: React.CSSProperties = {
    fontSize: '14px',
    color: muted ? 'var(--texto-soft)' : 'var(--texto)',
    margin: 0,
    textDecoration: 'none',
    fontWeight: 500,
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      {labelEl}
      {href ? (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          style={{ ...valueStyle, color: 'var(--terra)' }}
        >
          {value}
        </a>
      ) : (
        <p style={valueStyle}>{value}</p>
      )}
    </div>
  )
}
