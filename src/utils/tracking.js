const eventDefinitions = {
    whatsapp_cta: { event: 'click_whatsapp', cta_location: 'generic_cta' },
    whatsapp_header: { event: 'click_whatsapp', cta_location: 'header' },
    whatsapp_floating: { event: 'click_whatsapp', cta_location: 'floating_button' },
    whatsapp_hero: { event: 'click_whatsapp', cta_location: 'hero' },
    whatsapp_contact: { event: 'click_whatsapp', cta_location: 'contact_section' },
    whatsapp_services: { event: 'click_whatsapp', cta_location: 'services_section' },
    maps_contact: { event: 'direction_click', cta_location: 'contact_section' },
    phone_contact: { event: 'click_phone', cta_location: 'contact_section' },
}

function getEventPayload(eventName, parameters = {}) {
    const definition = eventDefinitions[eventName]

    return {
        event: definition?.event || eventName,
        cta_location: definition?.cta_location || 'other',
        ...parameters,
    }
}

export function trackEvent(eventName, parameters = {}) {
    const payload = getEventPayload(eventName, parameters)

    if (typeof window === 'undefined') return

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)

    if (typeof window.gtag === 'function') {
        const { event, ...eventParameters } = payload
        window.gtag('event', event, eventParameters)

        if (event === 'click_whatsapp') {
            window.gtag('event', 'conversion', {
                send_to: 'AW-18410721657/BW3WCKySioKcEPmi9cpE',
            })
        }
    }

    if (import.meta.env.DEV) {
        console.debug('[tracking]', payload)
    }
}

export function handleCtaClick(eventName, parameters) {
    trackEvent(eventName, parameters)
}
