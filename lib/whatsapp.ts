/**
 * Construye un link wa.me con mensaje prellenado.
 *
 * @param phone Número internacional sin "+" (ej: "51987654321"). Si viene
 *              como placeholder "#####" o vacío, devuelve `null` para que
 *              el caller pueda decidir ocultar el CTA.
 * @param message Mensaje a prellenar. Se urlencodea.
 */
export function whatsappUrl(
  phone?: string | null,
  message?: string | null,
): string | null {
  if (!phone) return null
  const cleaned = phone.replace(/[^0-9]/g, '')
  if (!cleaned) return null // placeholders tipo "#####" dan string vacío
  const base = `https://wa.me/${cleaned}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

/**
 * Mensaje contextual para WhatsApp en una ficha de terreno.
 */
export function terrenoWhatsappMessage(
  terrenoTitle: string,
  terrenoSlug: string,
  siteUrl: string,
): string {
  return `Hola, me interesa el terreno "${terrenoTitle}" que vi en ${siteUrl}/terrenos/${terrenoSlug}. ¿Me pueden dar más información?`
}
