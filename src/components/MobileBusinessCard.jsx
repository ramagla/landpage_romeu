import { services, siteConfig } from '../config/site'
import { handleCtaClick } from '../utils/tracking'
import { SafeImage } from './SafeImage'
import { WhatsAppIcon } from './WhatsAppIcon'

export function MobileBusinessCard() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#15130f] text-[#f8f1e8] md:hidden">
            <section className="relative min-h-screen px-5 pb-5 pt-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,193,154,0.22),transparent_18rem),radial-gradient(circle_at_bottom_right,rgba(127,151,130,0.24),transparent_20rem)]" />

                <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-sm flex-col">
                    <header className="flex items-center justify-between">
                        <img
                            src="/images/logo-branco.png"
                            alt={siteConfig.brandName}
                            className="h-16 w-auto max-w-[180px] object-contain"
                            width="180"
                            height="64"
                        />

                        <a
                            href={siteConfig.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Abrir Instagram da Romeu Beauty"
                            onClick={() => handleCtaClick('instagram_header')}
                            className="rounded-full border border-[#d7c19a]/40 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#d7c19a]"
                        >
                            Instagram
                        </a>
                    </header>

                    <div className="mt-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#d7c19a]">
                            Makeup & Hair
                        </p>

                        <h1 className="mt-2 font-display text-[2.75rem] font-semibold leading-[0.88] tracking-[-0.05em]">
                            Beleza com técnica e presença.
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-white/65">
                            Cabelo, maquiagem e visagismo com atendimento premium em São Paulo.
                        </p>
                    </div>

                    <div className="relative mt-4">
                        <div className="absolute -left-4 top-8 h-36 w-36 rounded-full bg-[#d7c19a]/30 blur-2xl" />
                        <div className="absolute -right-5 top-12 h-32 w-32 rounded-full bg-[#7f9782]/30 blur-2xl" />

                        <div className="relative grid grid-cols-[0.92fr_1.08fr] items-stretch gap-3">
                            <div className="overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/5 p-1.5 shadow-2xl shadow-black/30">
                                <SafeImage
                                    src="/images/romeu-principal.jpg"
                                    alt="Romeu Ferrazin, profissional da Romeu Beauty"
                                    className="h-[15.5rem] w-full rounded-[1.1rem] object-cover object-center"
                                    fallbackLabel="Romeu"
                                    loading="eager"
                                    fetchPriority="high"
                                    decoding="async"
                                    width="360"
                                    height="496"
                                />
                            </div>

                            <div className="rounded-[1.5rem] border border-[#ead8b3]/45 bg-[#f8f1e8] p-4 text-[#191714] shadow-2xl shadow-black/30">
                                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#8a7552]">
                                    Agende agora
                                </p>

                                <h2 className="mt-2 font-display text-2xl font-semibold leading-none">
                                    Consulte valores e horários
                                </h2>

                                <p className="mt-2 text-xs leading-5 text-[#5a4b3a]">
                                    Atendimento no salão, com experiência personalizada para cada cliente.
                                </p>

                                <a
                                    href={siteConfig.whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Consultar horários disponíveis pelo WhatsApp"
                                    onClick={() => handleCtaClick('whatsapp_hero')}
                                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-xs font-bold text-[#08240f]"
                                >
                                    <WhatsAppIcon className="h-4 w-4" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                        <a
                            href={siteConfig.whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Chamar Romeu Beauty no WhatsApp"
                            onClick={() => handleCtaClick('whatsapp_hero')}
                            className="rounded-[1rem] border border-[#d7c19a]/35 bg-white/[0.04] p-3 text-center"
                        >
                            <p className="text-lg text-[#d7c19a]">☎</p>
                            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                                WhatsApp
                            </p>
                        </a>

                        <a
                            href={siteConfig.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Abrir Instagram da Romeu Beauty"
                            onClick={() => handleCtaClick('instagram_header')}
                            className="rounded-[1rem] border border-[#d7c19a]/35 bg-white/[0.04] p-3 text-center"
                        >
                            <p className="text-lg text-[#d7c19a]">◎</p>
                            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                                Instagram
                            </p>
                        </a>

                        <a
                            href={siteConfig.mapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Ver endereço da Romeu Beauty no Google Maps"
                            onClick={() => handleCtaClick('maps_contact')}
                            className="rounded-[1rem] border border-[#d7c19a]/35 bg-white/[0.04] p-3 text-center"
                        >
                            <p className="text-lg text-[#d7c19a]">⌖</p>
                            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                                Endereço
                            </p>
                        </a>
                    </div>

                    <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#d7c19a]">
                            Serviços
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {services.map((service) => (
                                <span
                                    key={service.title}
                                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[0.72rem] font-medium text-white/72"
                                >
                                    {service.title}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#d7c19a]">
                            Local
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/62">
                            {siteConfig.shortAddress}
                        </p>
                    </div>

                    <div className="mt-auto pt-4 text-center">
                        <p className="font-display text-2xl font-semibold">{siteConfig.brandName}</p>
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/40">
                            Desde 2002
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}