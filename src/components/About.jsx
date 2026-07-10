export function About() {
    return (
        <section id="sobre" className="relative bg-[#f6efe6] px-6 py-20 lg:px-10 lg:py-24" aria-labelledby="about-title">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#8a7552]">Sobre</p>
                    <h2 id="about-title" className="mt-5 font-display text-4xl font-semibold leading-none tracking-[-0.03em] text-[#201b15] md:text-6xl">
                        À frente de Romeu Beauty
                    </h2>
                </div>

                <div className="space-y-6 text-base leading-8 text-[#4b4135] md:text-lg md:leading-9">
                    <p>
                        Desde 2002, Romeu Ferrazin atua no mercado da beleza transformando autoestima por meio de cabelo, maquiagem e visagismo. À frente de Romeu Beauty, une experiência, sensibilidade estética e atendimento personalizado para valorizar a beleza única de cada cliente.
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
    )
}