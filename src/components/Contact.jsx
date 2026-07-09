import { siteConfig } from '../config/site'
import { handleCtaClick } from '../utils/tracking'
import { WhatsAppButton } from './WhatsAppButton'

export function Contact() {
    return (
        <section id="contato" className="relative bg-[#191714] px-6 py-20 text-[#f8f1e8] lg:px-10 lg:py-24" aria-labelledby="contact-title">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,172,120,0.2),transparent_34rem)]" />
            <div className="relative mx-auto max-w-5xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d7c19a]">Agendamento</p>
                <h2 id="contact-title" className="mt-6 font-display text-4xl font-semibold leading-none tracking-[-0.03em] md:text-7xl">
                    Viva uma experiência de beleza personalizada.
                </h2>
                <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/66">
                    Atendimento no salão localizado na Rua Monte Alegre, 47, São Paulo. Consulte valores, horários disponíveis e escolha o melhor momento para cuidar da sua imagem.
                </p>

                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                    <WhatsAppButton trackingEvent="whatsapp_contact" ariaLabel="Agendar pelo WhatsApp">
                        Agendar pelo WhatsApp
                    </WhatsAppButton>

                    <a
                        href={siteConfig.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Ver endereço da RF Beauty Artist no Google Maps"
                        onClick={() => handleCtaClick('maps_contact')}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:-translate-y-1 hover:border-[#d7c19a] hover:text-[#d7c19a] focus:outline-none focus:ring-2 focus:ring-[#d7c19a] focus:ring-offset-2 focus:ring-offset-[#191714]"
                    >
                        Ver endereço
                    </a>
                </div>
            </div>
        </section>
    )
}