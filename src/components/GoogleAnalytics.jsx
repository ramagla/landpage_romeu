import { useEffect } from 'react'

function addScript(source) {
    if (document.querySelector(`script[src="${source}"]`)) return

    const script = document.createElement('script')
    script.async = true
    script.src = source
    document.head.appendChild(script)
}

export function GoogleAnalytics() {
    useEffect(() => {
        const gtmId = import.meta.env.VITE_GTM_ID
        const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-VJNEGM0MP0'

        window.dataLayer = window.dataLayer || []
        window.gtag = window.gtag || function gtag() {
            window.dataLayer.push(arguments)
        }

        if (gtmId) {
            addScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`)
            window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
            return
        }

        if (measurementId) {
            addScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`)
            window.gtag('js', new Date())
            window.gtag('config', measurementId)
        }
    }, [])

    return null
}
