import { useState } from 'react'

export function SafeImage({
    src,
    alt,
    className = '',
    fallbackLabel = 'Imagem',
    loading = 'lazy',
    fetchPriority,
    decoding = 'async',
    width,
    height,
}) {
    const [hasError, setHasError] = useState(false)

    if (hasError) {
        return (
            <div className={`flex items-center justify-center bg-[#eee2d0] text-center ${className}`}>
                <div>
                    <p className="font-display text-4xl font-semibold text-[#201b15]">RF</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#8a7552]">{fallbackLabel}</p>
                </div>
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding={decoding}
            width={width}
            height={height}
            onError={() => setHasError(true)}
        />
    )
}