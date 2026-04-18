import { whatsappUrl } from '@/lib/whatsapp'

interface Props {
  /** Número internacional sin "+" (ej: "51987654321"). */
  phone?: string | null
  /** Mensaje prellenado. Si no se pasa, se usa genérico. */
  message?: string | null
}

/**
 * Botón flotante de WhatsApp (esquina inferior derecha).
 * Si el número es un placeholder o está vacío, el componente no se renderiza,
 * así no queda un botón roto en producción mientras el número no esté listo.
 *
 * El mensaje prellenado puede sobreescribirse por página (ej: desde la ficha
 * de un terreno para incluir el título del lote).
 */
export default function WhatsAppFloat({ phone, message }: Props) {
  const href = whatsappUrl(
    phone,
    message || 'Hola, vi su web Terrenosentrujillo.pe y quisiera más información.',
  )

  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 50,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#25D366',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Icono WhatsApp (SVG inline, sin depender de librería) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.79 11.79 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.87c0 2.09.55 4.13 1.6 5.93L0 24l6.34-1.66a11.87 11.87 0 0 0 5.7 1.45h.01c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.23-6.15-3.4-8.44zM12.05 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.76.99 1-3.66-.24-.38a9.86 9.86 0 0 1-1.51-5.29c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.43 9.92-9.85 9.92zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.88 1.22 3.08.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
      </svg>
    </a>
  )
}
