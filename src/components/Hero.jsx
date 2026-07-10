import { services, siteConfig } from '../config/site'
import { handleCtaClick } from '../utils/tracking'
import { Header } from './Header'
import { SafeImage } from './SafeImage'
import { WhatsAppButton } from './WhatsAppButton'

export function Hero() {
    return (
        <section id="inicio" className="relative overflow-hidden bg-[#191714] text-[#f8f1e8]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,172,120,0.28),transparent_34rem),radial-gradient(circle_at_bottom_left,rgba(127,151,130,0.18),transparent_28rem),linear-gradient(135deg,rgba(25,23,20,0.96),rgba(25,23,20,0.76))]" />
            <Header />

            <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6.5rem)] max-w-7xl items-center gap-10 px-5 pb-16 pt-4 md:min-h-[calc(100vh-7rem)] md:grid-cols-[1.02fr_0.98fr] md:px-6 md:pb-20 md:pt-8 lg:px-10">
                <div className="reveal">
                    <div className="mb-5 inline-flex rounded-full border border-[#d7c19a]/40 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#d7c19a] md:mb-8">
                        Desde 2002
                    </div>

                    <h1 className="font-display max-w-4xl text-[3rem] font-semibold leading-[0.9] tracking-[-0.04em] md:text-8xl">
                        Beleza com técnica, elegância e personalidade.
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-[#f8f1e8]/78 md:mt-8 md:text-lg md:leading-8">
                        Cabelo, maquiagem e visagismo em São Paulo para realçar sua beleza com técnica, elegância e sofisticação.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row md:mt-10">
                        <WhatsAppButton trackingEvent="whatsapp_hero" ariaLabel="Agendar avaliação pelo WhatsApp">
                            Agendar avaliação pelo WhatsApp
                        </WhatsAppButton>

                        <a
                            href={siteConfig.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Ver Instagram da Romeu Beauty"
                            onClick={() => handleCtaClick('instagram_header')}
                            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:-translate-y-1 hover:border-[#d7c19a] hover:text-[#d7c19a] focus:outline-none focus:ring-2 focus:ring-[#d7c19a] focus:ring-offset-2 focus:ring-offset-[#191714]"
                        >
                            Ver Instagram
                        </a>
                    </div>

                    <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-7 md:mt-12 md:gap-4 md:pt-8">
                        <div>
                            <p className="font-display text-3xl font-semibold text-[#d7c19a] md:text-4xl">20+</p>
                            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/55 md:text-xs">anos</p>
                        </div>
                        <div>
                            <p className="font-display text-3xl font-semibold text-[#d7c19a] md:text-4xl">{services.length}</p>
                            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/55 md:text-xs">serviços</p>
                        </div>
                        <div>
                            <p className="font-display text-3xl font-semibold text-[#d7c19a] md:text-4xl">100%</p>
                            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/55 md:text-xs">personalizado</p>
                        </div>
                    </div>
                </div>

                <div className="reveal relative mx-auto w-full max-w-[32rem]">
                    <div className="absolute -inset-4 rounded-[2.5rem] bg-[#d7c19a]/20 blur-3xl md:-inset-6 md:rounded-[3rem]" />
                    <div className="float-soft relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-2.5 shadow-2xl shadow-black/40 backdrop-blur md:rounded-[3rem] md:p-3">
                        <SafeImage
                            src="/images/romeu-principal.jpg"
                            alt="Romeu Ferrazin, profissional da Romeu Beauty"
                            className="h-[22rem] w-full rounded-[1.5rem] object-cover object-center md:h-[32rem] md:rounded-[2.4rem]"
                            fallbackLabel="Romeu Ferrazin"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            width="768"
                            height="960"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}