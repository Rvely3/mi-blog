import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import WhatsAppFloat from '@/app/components/WhatsAppFloat'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

const siteUrl = getSiteUrl()
const siteName = 'Terrenosentrujillo.pe'
const defaultDescription =
  'Terrenos en venta en Trujillo y La Libertad. Fichas con precio, área y ubicación, contacto directo por WhatsApp con el corredor.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Terrenos en Trujillo | ${siteName}`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: siteUrl,
    siteName,
    title: `Terrenos en Trujillo | ${siteName}`,
    description: defaultDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Terrenos en Trujillo | ${siteName}`,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()

  return (
    <html
      lang="es-PE"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <WhatsAppFloat
          phone={settings?.whatsapp}
          message={settings?.whatsappDefaultMessage}
        />
      </body>
    </html>
  )
}
