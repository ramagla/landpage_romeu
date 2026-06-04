import { useState } from 'react'
import './index.css'

const whatsappNumber = '5511964698679'
const whatsappMessage = encodeURIComponent(
    'Olá, Romeu! Vim pelo site da RF Beauty Artist e gostaria de consultar valores e disponibilidade para agendamento.'
)

const links = {
    whatsapp: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
    instagram: 'https://www.instagram.com/romeubeauty/',
    facebook: 'https://www.facebook.com/people/Romeu-Beauty/100081464535551/',
    maps: 'https://www.google.com/maps/search/?api=1&query=Rua%20Monte%20Alegre%2047%2C%20S%C3%A3o%20Paulo%2C%20Brazil%2005014-000',
}

const services = [
    {
        title: 'Mechas de baixo orçamento',
        description: 'Iluminação dos fios com técnica, equilíbrio e cuidado.',
    },
    {
        title: 'Colorimetria',
        description: 'Análise técnica para tons harmônicos e personalizados.',
    },
    {
        title: 'Mega hair',
        description: 'Volume e comprimento com acabamento natural.',
    },
    {
        title: 'Maquiagem social',
        description: 'Produções elegantes para eventos e ocasiões especiais.',
    },
    {
        title: 'Maquiagem artística',
        description: 'Criações expressivas para propostas criativas.',
    },
    {
        title: 'Visagismo',
        description: 'Imagem, beleza e identidade em harmonia.',
    },
]

const education = [
    'Studio L’Oréal',
    'Studio Wella',
    'Senac',
    'Philip Hallawell',
    'Escola Madre',
    'Studio Tati Cordeiro',
]

const portfolio = [
    '/images/portfolio-01.jpg',
    '/images/portfolio-02.jpg',
    '/images/portfolio-03.jpg',
    '/images/portfolio-04.jpg',
    '/images/portfolio-05.jpg',
    '/images/portfolio-06.jpg',
    '/images/portfolio-07.jpg',
    '/images/portfolio-08.jpg',
    '/images/portfolio-09.jpg',
    '/images/portfolio-10.jpg',
]

function WhatsAppIcon({ className = 'h-5 w-5' }) {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className={`${className} fill-current`}>
            <path d="M16.04 3.2c-7.05 0-12.78 5.72-12.78 12.76 0 2.25.59 4.45 1.72 6.39L3.15 29l6.82-1.79a12.7 12.7 0 0 0 6.07 1.55h.01c7.04 0 12.77-5.72 12.77-12.76S23.09 3.2 16.04 3.2Zm0 23.4h-.01a10.6 10.6 0 0 1-5.41-1.48l-.39-.23-4.05 1.06 1.08-3.95-.25-.41a10.55 10.55 0 0 1-1.62-5.63c0-5.86 4.78-10.63 10.65-10.63 2.84 0 5.52 1.11 7.53 3.12a10.55 10.55 0 0 1 3.12 7.55c0 5.86-4.78 10.6-10.65 10.6Zm5.84-7.95c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.59-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.09 1.3 3.3.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
        </svg>
    )
}

function SafeImage({ src, alt, className = '', fallbackLabel = 'Imagem' }) {
    const [hasError, setHasError] = useState(false)

    if (hasError) {
        return (
            <div className={`flex items-center justify-center bg-[#eee2d0] text-center ${className}`}>
                <div>
                    <p className="font-display text-4xl font-semibold text-[#201b15]">RF</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#8a7552]">{fallbackLabel}</p>
                </div>
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    )
}

function WhatsAppButton({ children, className = '' }) {
    return (
        <a
            href={links.whatsapp}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center gap-3 rounded-full border border-[#d7c19a]/70 bg-[#15130f] px-7 py-4 text-sm font-semibold text-[#f1dfba] shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-[#f1dfba] hover:bg-[#241f18] hover:text-white ${className}`}
        >
            <WhatsAppIcon />
            {children}
        </a>
    )
}

function MobileLanding() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#15130f] text-[#f8f1e8] md:hidden">
            <section className="relative min-h-screen px-5 pb-5 pt-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,193,154,0.22),transparent_18rem),radial-gradient(circle_at_bottom_right,rgba(127,151,130,0.24),transparent_20rem)]" />

                <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-sm flex-col">
                    <header className="flex items-center justify-between">
                        <img
                            src="/images/logo-branco.png"
                            alt="RF Beauty Artist"
                            className="h-16 w-auto max-w-[180px] object-contain"
                        />

                        <a
                            href={links.instagram}
                            target="_blank"
                            rel="noreferrer"
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
                                    alt="Romeu Ferrazin"
                                    className="h-[15.5rem] w-full rounded-[1.1rem] object-cover object-center"
                                    fallbackLabel="Romeu"
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
                                    href={links.whatsapp}
                                    target="_blank"
                                    rel="noreferrer"
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
                            href={links.whatsapp}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-[1rem] border border-[#d7c19a]/35 bg-white/[0.04] p-3 text-center"
                        >
                            <p className="text-lg text-[#d7c19a]">☎</p>
                            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                                WhatsApp
                            </p>
                        </a>

                        <a
                            href={links.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-[1rem] border border-[#d7c19a]/35 bg-white/[0.04] p-3 text-center"
                        >
                            <p className="text-lg text-[#d7c19a]">◎</p>
                            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                                Instagram
                            </p>
                        </a>

                        <a
                            href={links.maps}
                            target="_blank"
                            rel="noreferrer"
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
                            Rua Monte Alegre, 47 · São Paulo · 05014-000
                        </p>
                    </div>

                    <div className="mt-auto pt-4 text-center">
                        <p className="font-display text-2xl font-semibold">RF Beauty Artist</p>
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/40">
                            Desde 2002
                        </p>
                    </div>
                </div>
            </section>

            <a
                href={links.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="Chamar RF Beauty Artist no WhatsApp"
                className="fixed bottom-4 right-4 z-50 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-4 text-[#08240f] shadow-2xl shadow-black/35"
            >
                <WhatsAppIcon className="h-6 w-6" />
            </a>
        </main>
    )
}

function DesktopLanding() {
    return (
        <main className="hidden overflow-hidden text-[#191714] md:block">
            <section className="relative min-h-screen bg-[#191714] text-[#f8f1e8]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,172,120,0.28),transparent_34rem),linear-gradient(135deg,rgba(25,23,20,0.94),rgba(25,23,20,0.72))]" />

                <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
                    <a href="#inicio" className="flex items-center">
                        <img
                            src="/images/logo-branco.png"
                            alt="RF Beauty Artist"
                            className="h-24 w-auto max-w-[360px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
                        />
                    </a>

                    <nav className="hidden items-center gap-8 text-sm text-[#f8f1e8]/80 md:flex">
                        <a href="#sobre" className="transition hover:text-[#d7c19a]">Sobre</a>
                        <a href="#servicos" className="transition hover:text-[#d7c19a]">Serviços</a>
                        <a href="#portfolio" className="transition hover:text-[#d7c19a]">Portfólio</a>
                        <a href="#contato" className="transition hover:text-[#d7c19a]">Contato</a>
                    </nav>

                    <WhatsAppButton className="px-5 py-3">
                        Agendar
                    </WhatsAppButton>
                </header>

                <div id="inicio" className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
                    <div className="reveal">
                        <div className="mb-8 inline-flex rounded-full border border-[#d7c19a]/40 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#d7c19a]">
                            Desde 2002
                        </div>

                        <h1 className="font-display max-w-4xl text-6xl font-semibold leading-[0.9] tracking-[-0.04em] md:text-8xl">
                            Beleza com técnica, elegância e personalidade.
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#f8f1e8]/78">
                            Experiência premium em cabelo, maquiagem e visagismo para realçar a beleza única de cada mulher com sofisticação, acolhimento e resultado personalizado.
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <WhatsAppButton>
                                Consultar pelo WhatsApp
                            </WhatsAppButton>

                            <a
                                href={links.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:-translate-y-1 hover:border-[#d7c19a] hover:text-[#d7c19a]"
                            >
                                Ver Instagram
                            </a>
                        </div>

                        <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
                            <div>
                                <p className="font-display text-4xl font-semibold text-[#d7c19a]">20+</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/55">anos</p>
                            </div>
                            <div>
                                <p className="font-display text-4xl font-semibold text-[#d7c19a]">6</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/55">serviços</p>
                            </div>
                            <div>
                                <p className="font-display text-4xl font-semibold text-[#d7c19a]">100%</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/55">personalizado</p>
                            </div>
                        </div>
                    </div>

                    <div className="reveal relative mx-auto w-full max-w-[32rem]">
                        <div className="absolute -inset-6 rounded-[3rem] bg-[#d7c19a]/20 blur-3xl" />
                        <div className="float-soft relative overflow-hidden rounded-[3rem] border border-white/15 bg-white/8 p-3 shadow-2xl shadow-black/40 backdrop-blur">
                            <SafeImage
                                src="/images/romeu-principal.jpg"
                                alt="Romeu Ferrazin"
                                className="h-[32rem] w-full rounded-[2.4rem] object-cover object-center"
                                fallbackLabel="Foto principal"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section id="sobre" className="relative bg-[#f6efe6] px-6 py-24 lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.78fr_1.22fr]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8a7552]">Sobre</p>
                        <h2 className="mt-5 font-display text-5xl font-semibold leading-none tracking-[-0.03em] text-[#201b15] md:text-6xl">
                            RF Beauty Artist
                        </h2>
                    </div>

                    <div className="space-y-6 text-lg leading-9 text-[#4b4135]">
                        <p>
                            Desde 2002, Romeu Ferrazin atua no mercado da beleza transformando autoestima por meio de cabelo, maquiagem e visagismo. À frente da RF Beauty Artist, une experiência, sensibilidade estética e atendimento personalizado para valorizar a beleza única de cada mulher.
                        </p>
                        <p>
                            Cada atendimento é pensado para proporcionar uma experiência leve, acolhedora e sofisticada, respeitando o estilo, a personalidade e o momento de cada cliente.
                        </p>
                        <p>
                            Pontualidade, qualidade, perfeccionismo e excelência no atendimento fazem parte de cada etapa do processo.
                        </p>
                    </div>
                </div>
            </section>

            <section id="servicos" className="bg-[#201b15] px-6 py-24 text-[#f8f1e8] lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d7c19a]">Serviços</p>
                        <h2 className="mt-5 font-display text-5xl font-semibold leading-none tracking-[-0.03em] md:text-6xl">
                            Cabelo, maquiagem e imagem com acabamento premium.
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {services.map((service, index) => (
                            <article
                                key={service.title}
                                className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#d7c19a]/50 hover:bg-white/[0.07]"
                            >
                                <p className="font-display text-4xl font-semibold text-[#d7c19a]">
                                    {String(index + 1).padStart(2, '0')}
                                </p>
                                <h3 className="mt-8 text-2xl font-semibold">{service.title}</h3>
                                <p className="mt-4 leading-7 text-white/64">{service.description}</p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-12 rounded-[2rem] border border-[#d7c19a]/30 bg-[#d7c19a]/10 p-8 md:flex md:items-center md:justify-between">
                        <div>
                            <h3 className="font-display text-3xl font-semibold">Valores sob consulta</h3>
                            <p className="mt-2 max-w-2xl text-white/64">
                                Cada atendimento é personalizado conforme objetivo, técnica, cabelo, ocasião e tempo de execução.
                            </p>
                        </div>

                        <WhatsAppButton className="mt-6 md:mt-0">
                            Consultar disponibilidade
                        </WhatsAppButton>
                    </div>
                </div>
            </section>

            <section id="portfolio" className="bg-[#f6efe6] px-6 py-24 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8a7552]">Portfólio</p>
                            <h2 className="mt-5 font-display text-5xl font-semibold leading-none tracking-[-0.03em] text-[#201b15] md:text-6xl">
                                Resultados que valorizam identidade, presença e beleza.
                            </h2>
                        </div>

                        <a
                            href={links.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-full border border-[#201b15]/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#201b15] transition hover:border-[#8a7552] hover:bg-[#201b15] hover:text-white"
                        >
                            Acompanhar no Instagram
                        </a>
                    </div>

                    <div className="mt-14 columns-2 gap-5 lg:columns-3">
                        {portfolio.map((image, index) => (
                            <div
                                key={image}
                                className="mb-5 break-inside-avoid overflow-hidden rounded-[2rem] border border-[#d9c7a5]/70 bg-[#eee2d0] shadow-xl shadow-[#5b4b33]/10"
                            >
                                <SafeImage
                                    src={image}
                                    alt={`Trabalho RF Beauty Artist ${index + 1}`}
                                    className={`w-full object-cover transition duration-500 hover:scale-[1.04] ${index % 3 === 0 ? 'h-[30rem]' : 'h-[23rem]'}`}
                                    fallbackLabel={`Portfólio ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#efe2d0] px-6 py-24 lg:px-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,151,130,0.22),transparent_30rem),radial-gradient(circle_at_bottom_right,rgba(201,172,120,0.25),transparent_34rem)]" />

                <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7b6848]">Aperfeiçoamento</p>
                        <h2 className="mt-5 font-display text-5xl font-semibold leading-none tracking-[-0.03em] text-[#201b15] md:text-6xl">
                            Aperfeiçoamento profissional para resultados superiores.
                        </h2>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-[#5a4b3a]">
                            Uma trajetória construída com estudo, prática e atualização contínua em instituições reconhecidas no mercado da beleza.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {education.map((item, index) => (
                            <article
                                key={item}
                                className="group rounded-[1.7rem] border border-[#2a241c]/10 bg-[#201b15] p-6 text-[#f8f1e8] shadow-2xl shadow-[#5b4b33]/10 transition duration-300 hover:-translate-y-1 hover:border-[#d7c19a]/70"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="inline-flex rounded-full border border-[#d7c19a]/50 bg-[#d7c19a]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#d7c19a]">
                                        Formação
                                    </span>
                                    <span className="font-display text-3xl font-semibold text-[#d7c19a]/70">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-white">{item}</h3>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contato" className="relative bg-[#191714] px-6 py-24 text-[#f8f1e8] lg:px-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,172,120,0.2),transparent_34rem)]" />
                <div className="relative mx-auto max-w-5xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d7c19a]">Agendamento</p>
                    <h2 className="mt-6 font-display text-5xl font-semibold leading-none tracking-[-0.03em] md:text-7xl">
                        Pronta para viver uma experiência de beleza personalizada?
                    </h2>
                    <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/66">
                        Atendimento no salão localizado na Rua Monte Alegre, 47, São Paulo. Consulte valores, horários disponíveis e escolha o melhor momento para cuidar da sua imagem.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <WhatsAppButton>
                            Agendar pelo WhatsApp
                        </WhatsAppButton>

                        <a
                            href={links.maps}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:-translate-y-1 hover:border-[#d7c19a] hover:text-[#d7c19a]"
                        >
                            Ver endereço
                        </a>
                    </div>
                </div>
            </section>

            <footer className="bg-[#0f0e0c] px-6 py-10 text-[#f8f1e8]/64 lg:px-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="font-display text-3xl font-semibold text-white">RF Beauty Artist</p>
                        <p className="mt-1 text-sm">Makeup & Hair · Desde 2002</p>
                    </div>

                    <div className="flex flex-wrap gap-5 text-sm">
                        <a href={links.instagram} target="_blank" rel="noreferrer" className="transition hover:text-[#d7c19a]">
                            Instagram
                        </a>
                        <a href={links.facebook} target="_blank" rel="noreferrer" className="transition hover:text-[#d7c19a]">
                            Facebook
                        </a>
                        <a href={links.maps} target="_blank" rel="noreferrer" className="transition hover:text-[#d7c19a]">
                            Rua Monte Alegre, 47
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    )
}

function App() {
    return (
        <>
            <MobileLanding />
            <DesktopLanding />
        </>
    )
}

export default App
