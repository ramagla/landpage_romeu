const siteUrl = import.meta.env.VITE_SITE_URL || 'https://landpage-romeu.vercel.app'
const brandName = import.meta.env.VITE_BRAND_NAME || 'RF Beauty Artist'
const professionalName = import.meta.env.VITE_PROFESSIONAL_NAME || 'Romeu Ferrazin'
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5511964698679'
const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/romeubeauty/'
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/people/Romeu-Beauty/100081464535551/'
const address = import.meta.env.VITE_ADDRESS || 'Rua Monte Alegre, 47, São Paulo, Brazil 05014-000'

const whatsappMessage = encodeURIComponent(
    `Olá, Romeu! Vim pelo site da ${brandName} e gostaria de consultar horários disponíveis e agendar uma avaliação.`
)

export const siteConfig = {
    siteUrl,
    canonicalUrl: `${siteUrl.replace(/\/$/, '')}/`,
    brandName,
    professionalName,
    whatsappNumber,
    phoneDisplay: '+55 11 96469-8679',
    instagramUrl,
    facebookUrl,
    address,
    shortAddress: 'Rua Monte Alegre, 47 · São Paulo · 05014-000',
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    whatsappUrl: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
}

export const services = [
    {
        title: 'Mechas de baixo orçamento',
        description: 'Iluminação dos fios com técnica, equilíbrio e cuidado para valorizar o visual com acabamento sofisticado.',
    },
    {
        title: 'Colorimetria',
        description: 'Análise técnica para tons harmônicos, personalizados e alinhados ao estilo de cada cliente.',
    },
    {
        title: 'Mega hair',
        description: 'Volume e comprimento com acabamento natural, respeitando a estrutura dos fios.',
    },
    {
        title: 'Maquiagem social',
        description: 'Produções elegantes para eventos e ocasiões especiais, com beleza duradoura e refinada.',
    },
    {
        title: 'Maquiagem artística',
        description: 'Criações expressivas para propostas criativas, editoriais e produções de impacto.',
    },
    {
        title: 'Visagismo',
        description: 'Imagem, beleza e identidade trabalhadas em harmonia para um resultado personalizado.',
    },
]

export const whyChooseItems = [
    {
        title: 'Desde 2002',
        description: 'Mais de 20 anos de experiência no mercado da beleza.',
    },
    {
        title: 'Atendimento personalizado',
        description: 'Cada cliente recebe uma experiência pensada para seu estilo, objetivo e momento.',
    },
    {
        title: 'Técnica e visagismo',
        description: 'Beleza, imagem e personalidade trabalhadas em harmonia.',
    },
    {
        title: 'Resultado sofisticado',
        description: 'Acabamento elegante, natural e alinhado à identidade de cada cliente.',
    },
]

export const education = [
    'Studio L’Oréal',
    'Studio Wella',
    'Senac',
    'Philip Hallawell',
    'Escola Madre',
    'Studio Tati Cordeiro',
]

export const portfolio = [
    {
        src: '/images/portfolio-01.jpg',
        alt: 'Resultado de cabelo e beleza realizado pela RF Beauty Artist',
    },
    {
        src: '/images/portfolio-02.jpg',
        alt: 'Produção de maquiagem e cabelo da RF Beauty Artist',
    },
    {
        src: '/images/portfolio-03.jpg',
        alt: 'Portfólio de atendimento de beleza RF Beauty Artist',
    },
    {
        src: '/images/portfolio-04.jpg',
        alt: 'Resultado de cabelo e maquiagem da RF Beauty Artist',
    },
    {
        src: '/images/portfolio-05.jpg',
        alt: 'Produção de beleza personalizada da RF Beauty Artist',
    },
    {
        src: '/images/portfolio-06.jpg',
        alt: 'Atendimento de cabelo e imagem realizado pela RF Beauty Artist',
    },
    {
        src: '/images/portfolio-07.jpg',
        alt: 'Portfólio de cabelo, maquiagem e visagismo da RF Beauty Artist',
    },
    {
        src: '/images/portfolio-08.jpg',
        alt: 'Resultado de beleza com acabamento premium da RF Beauty Artist',
    },
    {
        src: '/images/portfolio-09.jpg',
        alt: 'Produção de cabelo e maquiagem assinada pela RF Beauty Artist',
    },
    {
        src: '/images/portfolio-10.jpg',
        alt: 'Portfólio de atendimento premium em beleza da RF Beauty Artist',
    },
]