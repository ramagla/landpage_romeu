# RF Beauty Artist - Landing Page

Landing page profissional da RF Beauty Artist / Romeu Ferrazin, desenvolvida com React, Vite e Tailwind CSS para apresentar serviços de cabelo, maquiagem, mechas, colorimetria, mega hair e visagismo em São Paulo.

URL de produção atual: https://landpage-romeu.vercel.app

## Tecnologias

- React
- Vite
- Tailwind CSS
- Vercel
- Vercel Analytics

## Variáveis de ambiente

As variáveis abaixo podem ser configuradas na Vercel em todos os ambientes. O projeto possui fallbacks seguros em `src/config/site.js`.

```env
VITE_SITE_URL=https://landpage-romeu.vercel.app
VITE_BRAND_NAME=RF Beauty Artist
VITE_PROFESSIONAL_NAME=Romeu Ferrazin
VITE_WHATSAPP_NUMBER=5511964698679
VITE_INSTAGRAM_URL=https://www.instagram.com/romeubeauty/
VITE_FACEBOOK_URL=https://www.facebook.com/people/Romeu-Beauty/100081464535551/
VITE_ADDRESS=Rua Monte Alegre, 47, São Paulo, Brazil 05014-000
```

## Como rodar localmente

```bash
npm install
npm run dev
```

## Validações

```bash
npm run lint
npm run build
npm run preview
```

Observação: as versões atuais de Vite, Rolldown e ESLint exigem Node 20.19+ ou Node 22.12+. Use uma versão compatível para build local.

## Estrutura básica

```text
src/
  components/
    About.jsx
    Contact.jsx
    Education.jsx
    FloatingWhatsApp.jsx
    Footer.jsx
    Header.jsx
    Hero.jsx
    Portfolio.jsx
    SafeImage.jsx
    Services.jsx
    WhatsAppButton.jsx
    WhatsAppIcon.jsx
    WhyChoose.jsx
  config/
    site.js
  utils/
    tracking.js
  App.jsx
  index.css
  main.jsx
public/
  images/
  robots.txt
  sitemap.xml
```

## SEO

O projeto inclui metadados técnicos no `index.html`, Open Graph, Twitter Card, canonical, robots, sitemap e JSON-LD do tipo `BeautySalon` com informações confirmadas do negócio.

- Sitemap: https://landpage-romeu.vercel.app/sitemap.xml
- Robots: https://landpage-romeu.vercel.app/robots.txt
- Imagem OG atual: `https://landpage-romeu.vercel.app/images/romeu-principal.jpg`

Caso uma imagem social dedicada seja criada futuramente, ela pode ser publicada como `public/og-image.jpg` e os metadados devem ser atualizados para `https://landpage-romeu.vercel.app/og-image.jpg`.

## Analytics

O Vercel Analytics está implementado com `@vercel/analytics/react` e renderizado no app. Web Analytics também deve permanecer ativado no painel da Vercel.

Speed Insights não foi implementado porque está pendente por limite do plano Hobby.

## Tracking futuro

Os principais CTAs chamam `handleCtaClick` em `src/utils/tracking.js`. Hoje a função apenas registra eventos no console em desenvolvimento, sem Google Analytics, Meta Pixel ou ferramentas externas adicionais.

Eventos preparados:

- `whatsapp_hero`
- `whatsapp_services`
- `whatsapp_contact`
- `instagram_header`
- `instagram_portfolio`
- `maps_contact`

## Checklist antes de publicar

- Rodar `npm install`
- Rodar `npm run lint`
- Rodar `npm run build`
- Conferir desktop e mobile
- Testar WhatsApp, Instagram, Facebook e Maps
- Validar se `robots.txt` e `sitemap.xml` estão acessíveis
- Confirmar se o painel da Vercel Analytics está ativo
- Não fazer deploy manual pela CLI

## Domínio

O domínio atual é o domínio Vercel do projeto: `https://landpage-romeu.vercel.app`. Se houver troca para domínio próprio, atualizar `VITE_SITE_URL`, `index.html`, `robots.txt`, `sitemap.xml` e metadados sociais.