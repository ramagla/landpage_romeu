import { whyChooseItems } from '../config/site'

export function WhyChoose() {
    return (
        <section className="bg-[#201b15] px-6 py-20 text-[#f8f1e8] lg:px-10 lg:py-24" aria-labelledby="why-title">
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d7c19a]">Diferenciais</p>
                    <h2 id="why-title" className="mt-5 font-display text-4xl font-semibold leading-none tracking-[-0.03em] md:text-6xl">
                        Por que escolher Romeu Beauty?
                    </h2>
                </div>

                <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {whyChooseItems.map((item, index) => (
                        <article key={item.title} className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#d7c19a]/50 hover:bg-white/[0.07]">
                            <p className="font-display text-3xl font-semibold text-[#d7c19a]">{String(index + 1).padStart(2, '0')}</p>
                            <h3 className="mt-7 text-xl font-semibold text-white">{item.title}</h3>
                            <p className="mt-4 leading-7 text-white/64">{item.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}