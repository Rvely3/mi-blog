'use server'

import 'server-only'
import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'
import { writeClient } from '@/sanity/lib/writeClient'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'

/**
 * Server Action que procesa el formulario de /contacto.
 *
 * Flujo:
 *   1. Valida el payload con Zod.
 *   2. Persiste el lead como documento `lead` en Sanity (requiere write token).
 *   3. Envía email de aviso al corredor vía Resend (best-effort: si falla,
 *      igual devolvemos éxito porque el lead ya está guardado en Sanity).
 *
 * Retorna un objeto de estado que consume el ContactForm con `useActionState`.
 */

const LeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre es muy corto')
    .max(120, 'El nombre es muy largo'),
  email: z.string().trim().toLowerCase().email('Email inválido'),
  whatsapp: z
    .string()
    .trim()
    .max(30, 'Número muy largo')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(5, 'El mensaje es muy corto')
    .max(2000, 'El mensaje es muy largo'),
  // Honeypot anti-spam (bots lo llenan): si trae valor, silently drop.
  website: z.string().optional(),
})

export type LeadFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<'name' | 'email' | 'whatsapp' | 'message', string>>
}

export const initialLeadState: LeadFormState = { status: 'idle' }

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const raw = {
    name: String(formData.get('name') || ''),
    email: String(formData.get('email') || ''),
    whatsapp: String(formData.get('whatsapp') || ''),
    message: String(formData.get('message') || ''),
    website: String(formData.get('website') || ''),
  }

  // Honeypot: si un bot llenó el campo oculto, fingimos éxito y descartamos.
  if (raw.website) {
    return { status: 'success', message: 'Gracias, te contactaremos pronto.' }
  }

  const parsed = LeadSchema.safeParse(raw)
  if (!parsed.success) {
    const errors: LeadFormState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<LeadFormState['errors']>
      if (key && !errors[key]) errors[key] = issue.message
    }
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      errors,
    }
  }

  const data = parsed.data
  const headersList = await headers()
  const referer = headersList.get('referer') || undefined
  const userAgent = headersList.get('user-agent') || undefined

  // 1. Guardar en Sanity
  let sanityOk = false
  try {
    await writeClient.create({
      _type: 'lead',
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp || undefined,
      message: data.message,
      status: 'nuevo',
      source: referer,
      userAgent,
      createdAt: new Date().toISOString(),
    })
    sanityOk = true
  } catch (err) {
    console.error('[submitLead] Sanity write failed:', err)
  }

  // 2. Email al corredor (best-effort)
  let emailOk = false
  const resendKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const settings = await getSiteSettings()
  const to = settings?.email || process.env.CONTACT_TO_EMAIL

  if (resendKey && from && to) {
    try {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: `Nuevo lead: ${data.name}`,
        text: buildEmailText({ ...data, referer, siteUrl: getSiteUrl() }),
        html: buildEmailHtml({ ...data, referer, siteUrl: getSiteUrl() }),
      })
      emailOk = true
    } catch (err) {
      console.error('[submitLead] Resend send failed:', err)
    }
  }

  // Si nada funcionó, error real al usuario.
  if (!sanityOk && !emailOk) {
    return {
      status: 'error',
      message:
        'No pudimos enviar tu mensaje. Intenta escribirnos directamente por WhatsApp.',
    }
  }

  return {
    status: 'success',
    message:
      '¡Gracias! Recibimos tu mensaje. Te responderemos pronto por el medio que prefieras.',
  }
}

// ── Helpers internos de email ──

function buildEmailText(data: {
  name: string
  email: string
  whatsapp?: string
  message: string
  referer?: string
  siteUrl: string
}) {
  return `
Nuevo lead desde ${data.siteUrl}

Nombre: ${data.name}
Email: ${data.email}
WhatsApp: ${data.whatsapp || '—'}
Origen: ${data.referer || '—'}

Mensaje:
${data.message}
  `.trim()
}

function buildEmailHtml(data: {
  name: string
  email: string
  whatsapp?: string
  message: string
  referer?: string
  siteUrl: string
}) {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:4px 12px 4px 0;color:#8a6a4d;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;">${label}</td>
      <td style="padding:4px 0;color:#2b2016;font-size:14px;">${escapeHtml(value)}</td>
    </tr>`

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;">
  <p style="font-size:11px;letter-spacing:0.14em;color:#b36a3a;text-transform:uppercase;margin:0 0 6px;">Terrenosentrujillo.pe</p>
  <h1 style="font-family:Georgia,serif;font-size:22px;color:#2b2016;margin:0 0 20px;font-weight:500;">Nuevo lead recibido</h1>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    ${row('Nombre', data.name)}
    ${row('Email', data.email)}
    ${row('WhatsApp', data.whatsapp || '—')}
    ${row('Origen', data.referer || '—')}
  </table>
  <p style="font-size:12px;color:#8a6a4d;text-transform:uppercase;letter-spacing:0.08em;margin:16px 0 6px;">Mensaje</p>
  <div style="background:#faf6f0;border-radius:8px;padding:14px 16px;color:#2b2016;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(
    data.message,
  )}</div>
  <p style="margin-top:20px;font-size:11px;color:#a69584;">Respondiendo a este correo escribes directamente al remitente (${escapeHtml(
    data.email,
  )}).</p>
</div>
  `.trim()
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
