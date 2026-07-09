import { siteConfig } from '../config/site'
import { handleCtaClick } from '../utils/tracking'
import { WhatsAppButton } from './WhatsAppButton'

const navItems = [
    { href: '#sobre', label: 'Sobre' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#portfolio', label: 'Portfólio' },
    { href: '#contato', label: 'Contato' },
]

export function Header() {
    return (
        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10 lg:py-7">
            <a href="#inicio" className="flex items-center" aria-label={`${siteConfig.brandName} - início`}>
                <img
                    src="/images/logo-branco.png"
                    alt={siteConfig.brandName}
                    className="h-16 w-auto max-w-[180px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] md:h-24 md:max-w-[360px]"
                    width="360"
                    height="120"
                />
            </a>

            <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-sm text-[#f8f1e8]/80 md:flex">
                {navItems.map((item) => (
                    <a key={item.href} href={item.href} className="transition hover:text-[#d7c19a] focus:outline-none focus:ring-2 focus:ring-[#d7c19a] focus:ring-offset-2 focus:ring-offset-[#191714]">
                        {item.label}
                    </a>
                ))}
            </nav>

            <div className="hidden md:block">
                <WhatsAppButton className="px-5 py-3" trackingEvent="whatsapp_header" ariaLabel="Agendar avaliação pelo WhatsApp">
                    Agendar avaliação
                </WhatsAppButton>
            </div>

            <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir Instagram da RF Beauty Artist"
                onClick={() => handleCtaClick('instagram_header')}
                className="rounded-full border border-[#d7c19a]/40 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#d7c19a] transition hover:border-[#f1dfba] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#d7c19a] md:hidden"
            >
                Instagram
            </a>
        </header>
    )
}