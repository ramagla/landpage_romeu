import { education } from '../config/site'

export function Education() {
    return (
        <section className="relative overflow-hidden bg-[#efe2d0] px-6 py-20 lg:px-10 lg:py-24" aria-labelledby="education-title">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,151,130,0.22),transparent_30rem),radial-gradient(circle_at_bottom_right,rgba(201,172,120,0.25),transparent_34rem)]" />

            <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#7b6848]">Aperfeiçoamento</p>
                    <h2 id="education-title" className="mt-5 font-display text-4xl font-semibold leading-none tracking-[-0.03em] text-[#201b15] md:text-6xl">
                        Aperfeiçoamento profissional para resultados superiores.
                    </h2>
                    <p className="mt-6 max-w-xl text-lg leading-8 text-[#5a4b3a]">
                        Uma trajetória construída com estudo, prática e atualização contínua em instituições reconhecidas no mercado da beleza.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {education.map((item, index) => (
                        <article key={item} className="group rounded-[1.7rem] border border-[#2a241c]/10 bg-[#201b15] p-6 text-[#f8f1e8] shadow-2xl shadow-[#5b4b33]/10 transition duration-300 hover:-translate-y-1 hover:border-[#d7c19a]/70">
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
    )
}