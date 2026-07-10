import { siteConfig } from '../config/site'
import { handleCtaClick } from '../utils/tracking'
import { WhatsAppIcon } from './WhatsAppIcon'

export function FloatingWhatsApp() {
    return (
        <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Chamar Romeu Beauty no WhatsApp"
            onClick={() => handleCtaClick('whatsapp_floating')}
            className="fixed bottom-4 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-4 text-[#08240f] shadow-2xl shadow-black/35 transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        >
            <WhatsAppIcon className="h-6 w-6" />
        </a>
    )
}