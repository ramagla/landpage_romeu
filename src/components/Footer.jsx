import { siteConfig } from '../config/site'
import { handleCtaClick } from '../utils/tracking'

export function Footer() {
    return (
        <footer className="bg-[#0f0e0c] px-6 py-10 text-[#f8f1e8]/64 lg:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-display text-3xl font-semibold text-white">{siteConfig.brandName}</p>
                    <p className="mt-1 text-sm">Makeup & Hair · Desde 2002</p>
                </div>

                <div className="flex flex-wrap gap-5 text-sm">
                    <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" aria-label="Abrir Instagram da RF Beauty Artist" onClick={() => handleCtaClick('instagram_footer')} className="transition hover:text-[#d7c19a] focus:outline-none focus:ring-2 focus:ring-[#d7c19a]">
                        Instagram
                    </a>
                    <a href={siteConfig.facebookUrl} target="_blank" rel="noreferrer" aria-label="Abrir Facebook da RF Beauty Artist" className="transition hover:text-[#d7c19a] focus:outline-none focus:ring-2 focus:ring-[#d7c19a]">
                        Facebook
                    </a>
                    <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" aria-label="Ver endereço da RF Beauty Artist no Google Maps" onClick={() => handleCtaClick('maps_contact')} className="transition hover:text-[#d7c19a] focus:outline-none focus:ring-2 focus:ring-[#d7c19a]">
                        Rua Monte Alegre, 47
                    </a>
                </div>
            </div>
        </footer>
    )
}