import { portfolio, siteConfig } from '../config/site'
import { handleCtaClick } from '../utils/tracking'
import { SafeImage } from './SafeImage'

export function Portfolio() {
    return (
        <section id="portfolio" className="bg-[#f6efe6] px-6 py-20 lg:px-10 lg:py-24" aria-labelledby="portfolio-title">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8a7552]">Portfólio</p>
                        <h2 id="portfolio-title" className="mt-5 font-display text-4xl font-semibold leading-none tracking-[-0.03em] text-[#201b15] md:text-6xl">
                            Resultados que valorizam identidade, presença e beleza.
                        </h2>
                    </div>

                    <a
                        href={siteConfig.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Acompanhar portfólio da RF Beauty Artist no Instagram"
                        onClick={() => handleCtaClick('instagram_portfolio')}
                        className="inline-flex rounded-full border border-[#201b15]/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#201b15] transition hover:border-[#8a7552] hover:bg-[#201b15] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8a7552] focus:ring-offset-2 focus:ring-offset-[#f6efe6]"
                    >
                        Acompanhar no Instagram
                    </a>
                </div>

                <div className="mt-14 columns-2 gap-5 lg:columns-3">
                    {portfolio.map((image, index) => (
                        <div key={image.src} className="mb-5 break-inside-avoid overflow-hidden rounded-[2rem] border border-[#d9c7a5]/70 bg-[#eee2d0] shadow-xl shadow-[#5b4b33]/10">
                            <SafeImage
                                src={image.src}
                                alt={image.alt}
                                className={`w-full object-cover transition duration-500 hover:scale-[1.04] ${index % 3 === 0 ? 'h-[30rem]' : 'h-[23rem]'}`}
                                fallbackLabel={`Portfólio ${index + 1}`}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}