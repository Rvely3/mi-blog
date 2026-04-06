export default function Footer() {
    return (
      <footer style={{
        background: 'var(--texto)',
        color: '#F5EDE4',
        padding: '3rem 2.5rem 1.5rem',
        fontFamily: 'var(--font-geist-sans)',
      }}>
        <style>{`
          @media (max-width: 768px) {
            .footer-top {
              grid-template-columns: 1fr !important;
            }
            .footer-bottom {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 12px !important;
            }
          }
        `}</style>
  
        {/* Fila superior: 3 columnas */}
        <div className="footer-top" style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
  
          {/* Columna 1: Logo + descripción */}
          <div>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              fontWeight: '500',
              color: '#F5EDE4',
              margin: '0 0 4px 0',
              letterSpacing: '-0.02em',
            }}>
              Tierra Viva
            </p>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: 'var(--terra)',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
            }}>
              Trujillo · La Libertad
            </p>
            <p style={{
              fontSize: '13px',
              color: 'rgba(245,237,228,0.55)',
              lineHeight: '1.7',
              margin: '0',
              maxWidth: '240px',
            }}>
              Aprendizaje, tecnología y desarrollo web — escrito sin rodeos y con criterio.
            </p>
          </div>
  
          {/* Columna 2: Navegación */}
          <div>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(245,237,228,0.4)',
              margin: '0 0 14px 0',
            }}>
              Navegar
            </p>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Artículos', href: '/#articulos' },
                { label: 'Sobre mí', href: '/sobre-mi' },
                { label: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} style={{
                    fontSize: '14px',
                    color: 'rgba(245,237,228,0.75)',
                    textDecoration: 'none',
                  }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
  
          {/* Columna 3: Este proyecto */}
          <div>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(245,237,228,0.4)',
              margin: '0 0 14px 0',
            }}>
              Este proyecto
            </p>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '¿Por qué este blog?', href: '/sobre-mi' },
                { label: 'Stack técnico', href: '/sobre-mi#stack' },
                { label: 'GitHub', href: 'https://github.com/Rvely3/mi-blog' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} style={{
                    fontSize: '14px',
                    color: 'rgba(245,237,228,0.75)',
                    textDecoration: 'none',
                  }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
  
        </div>
  
        {/* Fila inferior: copyright + legal */}
        <div className="footer-bottom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.5rem',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(245,237,228,0.35)', margin: '0' }}>
            © 2026 Tierra Viva · Roberto. Hecho desde Trujillo.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: 'Políticas de privacidad', href: '/privacidad' },
              { label: 'Aviso legal', href: '/aviso-legal' },
            ].map((link) => (
              <a key={link.href} href={link.href} style={{
                fontSize: '12px',
                color: 'rgba(245,237,228,0.35)',
                textDecoration: 'none',
              }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
  
      </footer>
    );
  }