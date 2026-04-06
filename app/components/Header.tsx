import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-white border-b" style={{ borderTopWidth: '3px', borderTopColor: 'var(--terra)', borderBottomColor: 'var(--borde)' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col" style={{ textDecoration: 'none' }}>
          <span className="text-base font-medium" style={{ color: 'var(--texto)', letterSpacing: '0.01em' }}>
            Tierra Viva
          </span>
          <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--terra)' }}>
            Trujillo · La Libertad
          </span>
        </Link>

        {/* Navegación */}
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm" style={{ color: 'var(--texto-mid)' }}>
            Inicio
          </Link>
          <Link href="/terrenos" className="text-sm" style={{ color: 'var(--texto-mid)' }}>
            Terrenos
          </Link>
          <Link href="/como-funciona" className="text-sm" style={{ color: 'var(--texto-mid)' }}>
            Cómo funciona
          </Link>
          <Link
            href="/contacto"
            className="text-xs font-medium text-white px-4 py-2 rounded-lg"
            style={{ background: 'var(--terra)' }}
          >
            Escríbenos
          </Link>
        </nav>

      </div>
    </header>
  )
}