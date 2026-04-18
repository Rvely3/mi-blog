import type { Metadata } from 'next'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Política de privacidad de Terrenos en Trujillo conforme a la Ley N° 29733 de Protección de Datos Personales del Perú.',
  alternates: { canonical: '/privacidad' },
  robots: { index: true, follow: false },
}

export default async function PrivacidadPage() {
  const settings = await getSiteSettings()
  const siteUrl = getSiteUrl()

  const companyName =
    settings?.legal?.companyName || settings?.siteName || 'Terrenos en Trujillo'
  const ruc = settings?.legal?.ruc || '[RUC pendiente]'
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
            { label: 'Política de privacidad' },
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
            Política de privacidad
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
          <p>
            La presente Política de Privacidad describe cómo {companyName} (en
            adelante, &ldquo;el Titular&rdquo;), con RUC {ruc} y domicilio en {address},
            recopila, utiliza y protege los datos personales de los usuarios
            del sitio web <a href={siteUrl}>{siteUrl}</a>, en cumplimiento de
            la Ley N° 29733, Ley de Protección de Datos Personales, y su
            Reglamento aprobado por Decreto Supremo N° 003-2013-JUS.
          </p>

          <h2>1. Titular del banco de datos</h2>
          <p>
            <strong>{companyName}</strong>
            <br />
            RUC: {ruc}
            <br />
            Domicilio: {address}
            <br />
            Correo de contacto: <a href={`mailto:${email}`}>{email}</a>
          </p>

          <h2>2. Datos personales que recopilamos</h2>
          <p>
            A través del formulario de contacto del sitio recopilamos los
            siguientes datos que el usuario proporciona voluntariamente:
          </p>
          <ul>
            <li>Nombres y apellidos.</li>
            <li>Correo electrónico.</li>
            <li>Número de WhatsApp o teléfono (opcional).</li>
            <li>Mensaje y contenido de la consulta.</li>
          </ul>
          <p>
            Adicionalmente, de forma automática podemos registrar la dirección
            IP, el user-agent del navegador y la página de origen (referer),
            con fines de seguridad y prevención de abuso.
          </p>

          <h2>3. Finalidad del tratamiento</h2>
          <p>Los datos personales se tratan con las siguientes finalidades:</p>
          <ul>
            <li>
              Atender consultas relacionadas con los terrenos publicados,
              coordinar visitas y procesos de compraventa.
            </li>
            <li>
              Mantener un historial de contacto entre el Titular y el usuario
              mientras dure la relación comercial o de prospecto.
            </li>
            <li>
              Cumplir con obligaciones legales, contractuales y tributarias
              aplicables en Perú.
            </li>
            <li>
              Prevenir fraude y abusos del formulario mediante registro
              técnico (IP, user-agent).
            </li>
          </ul>
          <p>
            Los datos <strong>no</strong> se usan para envíos masivos de
            marketing salvo que el usuario lo autorice expresamente.
          </p>

          <h2>4. Base legal y consentimiento</h2>
          <p>
            El tratamiento de los datos se basa en el consentimiento libre,
            previo, expreso e informado que el usuario otorga al enviar el
            formulario de contacto, y en el interés legítimo del Titular para
            responder consultas comerciales que el propio usuario inicia.
          </p>

          <h2>5. Conservación de los datos</h2>
          <p>
            Los datos se conservan mientras dure la relación comercial y,
            posteriormente, por el plazo razonable que exija la ley peruana
            para la atención de posibles reclamos o auditorías, o hasta que el
            usuario solicite su supresión conforme al apartado 7.
          </p>

          <h2>6. Transferencia a terceros</h2>
          <p>
            No vendemos ni cedemos datos personales a terceros con fines
            comerciales. Únicamente se comparten datos con proveedores que
            actúan como encargados del tratamiento bajo contrato:
          </p>
          <ul>
            <li>
              <strong>Sanity</strong> (base de datos de contenido y leads) —
              almacenamiento en servidores internacionales.
            </li>
            <li>
              <strong>Resend</strong> — envío de notificaciones por correo
              electrónico al corredor.
            </li>
            <li>
              <strong>Vercel</strong> — infraestructura de hosting del sitio
              web.
            </li>
          </ul>
          <p>
            En los casos de flujo transfronterizo, los encargados ofrecen
            niveles de protección equivalentes a los exigidos por la
            legislación peruana.
          </p>

          <h2>7. Derechos del titular de los datos (ARCO-OP)</h2>
          <p>
            El usuario puede ejercer en todo momento los derechos de acceso,
            rectificación, cancelación, oposición, información y revocación
            del consentimiento sobre sus datos personales. Para ello, debe
            enviar una solicitud escrita al correo{' '}
            <a href={`mailto:${email}`}>{email}</a> indicando:
          </p>
          <ul>
            <li>Nombre completo y documento de identidad.</li>
            <li>Derecho que desea ejercer y solicitud concreta.</li>
            <li>Correo o medio de contacto para la respuesta.</li>
          </ul>
          <p>
            Se atenderá la solicitud dentro de los plazos previstos por la Ley
            N° 29733 y su Reglamento. Si considera que sus derechos no han
            sido atendidos, puede presentar una denuncia ante la Autoridad
            Nacional de Protección de Datos Personales (ANPDP) del Ministerio
            de Justicia y Derechos Humanos del Perú.
          </p>

          <h2>8. Medidas de seguridad</h2>
          <p>
            Aplicamos medidas técnicas y organizativas razonables para
            proteger los datos contra acceso no autorizado, alteración,
            pérdida o divulgación: conexiones cifradas (HTTPS), control de
            acceso a la base de datos y principios de mínimo privilegio en el
            personal autorizado.
          </p>

          <h2>9. Cookies y tecnologías similares</h2>
          <p>
            El sitio puede utilizar cookies técnicas necesarias para su
            funcionamiento y, eventualmente, cookies analíticas para entender
            de forma agregada cómo se usa. No se utilizan cookies con fines
            publicitarios de terceros. El usuario puede configurar su
            navegador para rechazar cookies, entendiendo que ciertas
            funcionalidades podrían verse afectadas.
          </p>

          <h2>10. Menores de edad</h2>
          <p>
            El sitio está dirigido a personas mayores de edad. No recopilamos
            intencionalmente datos de menores. Si detectamos que un dato
            corresponde a un menor, lo eliminaremos.
          </p>

          <h2>11. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política para reflejar cambios legales o
            del servicio. La fecha de última actualización al inicio de esta
            página indica su vigencia. Cambios sustanciales se comunicarán de
            forma destacada en el sitio.
          </p>

          <h2>12. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta política o sobre el
            tratamiento de sus datos personales:
          </p>
          <p>
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

// Layout tipográfico compartido por las páginas legales.
// Maneja headings, listas y enlaces con la paleta del sitio.
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
