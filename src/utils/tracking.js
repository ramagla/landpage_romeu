export function handleCtaClick(eventName) {
    if (import.meta.env.DEV) {
        console.debug('[tracking]', eventName)
    }
}