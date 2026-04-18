import type { Metadata } from 'next'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'

export const metadata: Metadata = {
  title: 'Aviso legal',
  description:
    'Aviso legal y términos de uso del sitio Terrenos en Trujillo. Información sobre la titularidad, condiciones de uso y responsabilidades.',
  alternates: { canonical: '/aviso-legal' },
  robots: { index: true, follow: false },
}

export default async function AvisoLegalPage() {
  const settings = await getSiteSettings()
  const siteUrl = getSiteUrl()

  const companyName =
    settings?.legal?.companyName || settings?.siteName || 'Terrenos en Trujillo'
  const ruc = settings?.legal?.ruc || '[RUC pendiente]'
  const brokerLicense = settings?.legal?.brokerLicense
  const email = settings?.email || '[email pendiente]'
  const address = settings?.address || 'Trujillo, La Libertad, Perú'
  const lastUpdated = '18 de abril de 2026'

  return (
    <div style={{ background: '#fff' }}>
      <section
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '2rem 1.5rem 5rem',
        }}
      >
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Aviso legal' },
          ]}
          siteUrl={siteUrl}
        />

        <header style={{ marginBottom: '2rem' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--terra)',
              margin: '0 0 8px 0',
            }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '32px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--texto)',
              margin: '0 0 10px 0',
              lineHeight: 1.2,
            }}
          >
            Aviso legal
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--texto-soft)',
              margin: 0,
            }}
          >
            Última actualización: {lastUpdated}
          </p>
        </header>

        <LegalBody>
          <h2>1. Datos del titular del sitio</h2>
          <p>
            Este sitio web, accesible en{' '}
            <a href={siteUrl}>{siteUrl}</a>, es operado por:
          </p>
          <p>
            <strong>{companyName}</strong>
            <br />
            RUC: {ruc}
            <br />
            Domicilio: {address}
            <br />
            Correo: <a href={`mailto:${email}`}>{email}</a>
            {brokerLicense && (
              <>
                <br />
                Registro de corredor: {brokerLicense}
              </>
            )}
          </p>

          <h2>2. Objeto del sitio</h2>
          <p>
            Este sitio tiene por finalidad informar sobre terrenos disponibles
            para la venta en Trujillo y alrededores, facilitando el contacto
            entre interesados y los propietarios o representantes legales de
            dichos inmuebles. {companyName} actúa como intermediario
            (corretaje inmobiliario) y no necesariamente como propietario de
            los terrenos listados.
          </p>

          <h2>3. Información de los terrenos</h2>
          <p>
            Toda la información publicada (precios, áreas, ubicaciones,
            fotografías, descripciones) se presenta con fines referenciales y
            es obtenida del propietario o de fuentes que consideramos
            confiables al momento de la publicación.
          </p>
          <p>
            Los precios pueden variar sin previo aviso por decisión del
            propietario, las áreas declaradas son las consignadas en los
            documentos registrales disponibles, y las imágenes son
            ilustrativas del estado al momento de tomarlas.
          </p>
          <p>
            Antes de cualquier acto de reserva o compra, el interesado deberá
            verificar por sí mismo o con asesoría independiente la partida
            registral actualizada en SUNARP, la situación tributaria del
            predio y cualquier otro aspecto relevante.
          </p>

          <h2>4. Uso del sitio</h2>
          <p>
            El usuario se compromete a usar este sitio conforme a la ley y a
            la buena fe. Queda prohibido:
          </p>
          <ul>
            <li>
              Utilizar el sitio para enviar comunicaciones no solicitadas o
              contenido fraudulento.
            </li>
            <li>
              Intentar acceder a áreas restringidas o vulnerar sistemas de
              seguridad.
            </li>
            <li>
              Reproducir o distribuir contenidos del sitio con fines
              comerciales sin autorización previa por escrito.
            </li>
            <li>
              Suplantar la identidad del Titular o inducir a error sobre la
              relación con él.
            </li>
          </ul>

          <h2>5. Propiedad intelectual</h2>
          <p>
            Los textos, marcas, logotipos, diseños, fotografías y demás
            contenidos del sitio son propiedad de {companyName} o de sus
            titulares, y están protegidos por las normas peruanas e
            internacionales sobre propiedad intelectual. Su uso no autorizado
            constituye infracción.
          </p>

          <h2>6. Limitación de responsabilidad</h2>
          <p>
            {companyName} no garantiza la disponibilidad continua del sitio
            ni la ausencia de errores. En la medida en que lo permita la ley:
          </p>
          <ul>
            <li>
              No se responde por perjuicios derivados del uso del sitio o de
              la imposibilidad de usarlo.
            </li>
            <li>
              No se responde por decisiones de compra tomadas sin la
              verificación legal recomendada en el punto 3.
            </li>
            <li>
              No se responde por contenidos de terceros enlazados desde el
              sitio.
            </li>
          </ul>

          <h2>7. Protección de datos personales</h2>
          <p>
            El tratamiento de los datos personales facilitados por los
            usuarios se rige por la{' '}
            <a href="/privacidad">Política de privacidad</a>, en cumplimiento
            de la Ley N° 29733.
          </p>

          <h2>8. Legislación aplicable y jurisdicción</h2>
          <p>
            Este aviso legal se rige por las leyes de la República del Perú.
            Para cualquier controversia relacionada con el sitio, las partes
            se someten a los jueces y tribunales del Distrito Judicial de La
            Libertad, salvo que una norma imperativa disponga otra cosa.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Para consultas sobre este aviso legal:
            <br />
            <strong>{companyName}</strong>
            <br />
            Correo: <a href={`mailto:${email}`}>{email}</a>
            <br />
            Dirección: {address}
          </p>
        </LegalBody>
      </section>
    </div>
  )
}

function LegalBody({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="legal-body"
      style={{
        fontSize: '15px',
        color: 'var(--texto-mid)',
        lineHeight: 1.8,
      }}
    >
      <style>{`
        .legal-body h2 {
          font-family: Georgia, serif;
          font-size: 18px;
          font-weight: 500;
          color: var(--texto);
          margin: 2rem 0 0.75rem;
          letter-spacing: -0.01em;
        }
        .legal-body p {
          margin: 0 0 1rem;
        }
        .legal-body ul {
          margin: 0 0 1rem;
          padding-left: 1.25rem;
        }
        .legal-body li {
          margin-bottom: 0.35rem;
        }
        .legal-body a {
          color: var(--terra);
          text-decoration: underline;
        }
        .legal-body strong {
          color: var(--texto);
          font-weight: 500;
        }
      `}</style>
      {children}
    </div>
  )
}
