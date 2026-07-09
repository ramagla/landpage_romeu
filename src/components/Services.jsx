import { services } from '../config/site'
import { WhatsAppButton } from './WhatsAppButton'

export function Services() {
    return (
        <section id="servicos" className="bg-[#201b15] px-6 py-20 text-[#f8f1e8] lg:px-10 lg:py-24" aria-labelledby="services-title">
            <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d7c19a]">Serviços</p>
                    <h2 id="services-title" className="mt-5 font-display text-4xl font-semibold leading-none tracking-[-0.03em] md:text-6xl">
                        Cabelo, maquiagem e imagem com acabamento premium.
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-white/66">
                        Trabalhamos com produtos de alta qualidade e técnicas atualizadas para preservar a saúde dos fios e entregar resultados alinhados ao seu estilo.
                    </p>
                </div>

                <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {services.map((service, index) => (
                        <article key={service.title} className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#d7c19a]/50 hover:bg-white/[0.07]">
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

                    <WhatsAppButton className="mt-6 md:mt-0" trackingEvent="whatsapp_services" ariaLabel="Consultar horários disponíveis pelo WhatsApp">
                        Consultar horários disponíveis
                    </WhatsAppButton>
                </div>
            </div>
        </section>
    )
}