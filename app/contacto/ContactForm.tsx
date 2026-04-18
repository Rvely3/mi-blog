'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  submitLead,
  initialLeadState,
  type LeadFormState,
} from '@/app/actions/submitLead'

export default function ContactForm() {
  const [state, formAction] = useActionState<LeadFormState, FormData>(
    submitLead,
    initialLeadState,
  )

  if (state.status === 'success') {
    return (
      <div
        style={{
          border: '1px solid var(--olivo)',
          background: 'var(--olivo-light)',
          borderRadius: '12px',
          padding: '2rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            color: 'var(--olivo)',
            margin: '0 0 8px 0',
            fontWeight: 500,
          }}
        >
          ¡Mensaje enviado!
        </p>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--texto-mid)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
      noValidate
    >
      <Field
        label="Nombre"
        name="name"
        type="text"
        autoComplete="name"
        required
        error={state.errors?.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.errors?.email}
      />
      <Field
        label="WhatsApp"
        name="whatsapp"
        type="tel"
        autoComplete="tel"
        hint="Opcional"
        error={state.errors?.whatsapp}
      />
      <TextareaField
        label="Mensaje"
        name="message"
        required
        error={state.errors?.message}
      />

      {/* Honeypot anti-spam (invisible para humanos) */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label>
          No llenar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === 'error' && state.message && (
        <p
          role="alert"
          style={{
            fontSize: '13px',
            color: '#7A3D1D',
            background: '#F3E8E0',
            padding: '10px 12px',
            borderRadius: '8px',
            margin: 0,
          }}
        >
          {state.message}
        </p>
      )}

      <SubmitButton />

      <p
        style={{
          fontSize: '11px',
          color: 'var(--texto-soft)',
          lineHeight: 1.5,
          margin: '4px 0 0 0',
        }}
      >
        Al enviar aceptas nuestra{' '}
        <a
          href="/privacidad"
          style={{ color: 'var(--terra)', textDecoration: 'underline' }}
        >
          política de privacidad
        </a>
        .
      </p>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: pending ? 'var(--terra-mid)' : 'var(--terra)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        padding: '12px 18px',
        border: 'none',
        borderRadius: '8px',
        cursor: pending ? 'wait' : 'pointer',
        marginTop: '4px',
        transition: 'background 0.2s',
      }}
    >
      {pending ? 'Enviando…' : 'Enviar mensaje'}
    </button>
  )
}

// ── Campos ──

interface FieldProps {
  label: string
  name: string
  type?: string
  autoComplete?: string
  required?: boolean
  hint?: string
  error?: string
}

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  required,
  hint,
  error,
}: FieldProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          fontSize: '12px',
          color: 'var(--texto-mid)',
          letterSpacing: '0.02em',
          fontWeight: 500,
        }}
      >
        {label}
        {!required && (
          <span style={{ color: 'var(--texto-soft)', marginLeft: '6px', fontWeight: 400 }}>
            {hint || 'opcional'}
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        style={{
          fontSize: '14px',
          padding: '10px 12px',
          border: `1px solid ${error ? '#C0704B' : 'var(--borde)'}`,
          borderRadius: '8px',
          background: '#fff',
          color: 'var(--texto)',
          outline: 'none',
        }}
      />
      {error && (
        <span style={{ fontSize: '12px', color: '#7A3D1D' }}>{error}</span>
      )}
    </label>
  )
}

function TextareaField({
  label,
  name,
  required,
  error,
}: {
  label: string
  name: string
  required?: boolean
  error?: string
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          fontSize: '12px',
          color: 'var(--texto-mid)',
          letterSpacing: '0.02em',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <textarea
        name={name}
        required={required}
        rows={5}
        aria-invalid={Boolean(error)}
        style={{
          fontSize: '14px',
          padding: '10px 12px',
          border: `1px solid ${error ? '#C0704B' : 'var(--borde)'}`,
          borderRadius: '8px',
          background: '#fff',
          color: 'var(--texto)',
          resize: 'vertical',
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
      {error && (
        <span style={{ fontSize: '12px', color: '#7A3D1D' }}>{error}</span>
      )}
    </label>
  )
}
