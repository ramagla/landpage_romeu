import { siteConfig } from '../config/site'
import { handleCtaClick } from '../utils/tracking'
import { WhatsAppIcon } from './WhatsAppIcon'

export function WhatsAppButton({ children, className = '', trackingEvent = 'whatsapp_cta', ariaLabel }) {
    return (
        <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={ariaLabel || `${children} - WhatsApp`}
            onClick={() => handleCtaClick(trackingEvent)}
            className={`inline-flex items-center justify-center gap-3 rounded-full border border-[#d7c19a]/70 bg-[#15130f] px-7 py-4 text-sm font-semibold text-[#f1dfba] shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-[#f1dfba] hover:bg-[#241f18] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#d7c19a] focus:ring-offset-2 focus:ring-offset-[#15130f] ${className}`}
        >
            <WhatsAppIcon />
            {children}
        </a>
    )
}