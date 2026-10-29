import { brand } from '../../config/brand.config'
import { Icon } from '../components/primitives'

const ICONS = {
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z',
  email: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 7l-10 6L2 7',
  pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z',
} as const

export function BusinessScreen() {
  const c = brand.contact
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapsQuery)}`
  const whatsappUrl = `https://wa.me/${c.whatsapp.replace(/\D/g, '')}`

  return (
    <div className="mx-auto grid max-w-[40rem] gap-5">
      <header className="py-4 text-center">
        <h1 className="text-3xl font-bold">{brand.name}</h1>
        <p className="mt-2 text-lg text-muted">{brand.tagline}</p>
      </header>

      <section className="card grid gap-4 p-6">
        <h2 className="text-lg font-semibold">Contacto</h2>
        <ContactRow icon={ICONS.pin} label={`${c.address}, ${c.city}, ${c.country}`} href={mapsUrl} />
        <ContactRow icon={ICONS.phone} label={c.phone} href={`tel:${c.phone.replace(/\s/g, '')}`} />
        <ContactRow icon={ICONS.email} label={c.email} href={`mailto:${c.email}`} />
        <ContactRow icon={ICONS.chat} label={`WhatsApp: ${c.phone}`} href={whatsappUrl} />
      </section>

      {brand.socials.length > 0 && (
        <section className="card grid gap-3 p-6">
          <h2 className="text-lg font-semibold">Redes</h2>
          <div className="flex flex-wrap gap-3">
            {brand.socials.map((s) => (
              <a key={s.url} className="btn btn--ghost" href={s.url} target="_blank" rel="noreferrer noopener">
                {s.label}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ContactRow({ icon, label, href }: { icon: string; label: string; href: string }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      className="-mx-2 flex items-center gap-3 rounded-xl p-2 no-underline transition-colors hover:bg-panel"
    >
      <span className="grid h-10 w-10 flex-none place-items-center rounded-full" style={{ background: 'var(--color-panel)' }}>
        <Icon path={icon} />
      </span>
      <span className="min-w-0 break-words">{label}</span>
    </a>
  )
}
