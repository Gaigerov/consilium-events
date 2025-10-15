import React, {useState} from 'react'

const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    retryCount?: number;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
    const [didError, setDidError] = useState(false)
    const [retryAttempts, setRetryAttempts] = useState(0)

    const handleError = () => {
        if (retryAttempts < (props.retryCount || 2)) {
            setRetryAttempts(prev => prev + 1)
        } else {
            setDidError(true)
        }
    }

    const {src, alt, style, className, fallbackSrc, retryCount, ...rest} = props

    const getCorrectedSrc = (originalSrc: string) => {
        if (originalSrc.startsWith('http')) {
            return originalSrc
        }

        if (originalSrc.startsWith('/')) {

            return `/consilium-events${originalSrc}`
        }

        return originalSrc
    }

    const getCurrentSrc = () => {
        if (!src) return ''

        if (retryAttempts === 1) {
            return src.replace(/\/+/g, '/')
        } else if (retryAttempts === 2) {
            return getCorrectedSrc(src)
        }

        return src
    }

    const currentSrc = getCurrentSrc()

    return didError ? (
        <div
            className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
            style={style}
        >
            <div className="flex items-center justify-center w-full h-full">
                <img
                    src={fallbackSrc || ERROR_IMG_SRC}
                    alt={alt || "Error loading image"}
                    {...rest}
                    data-original-url={src}
                />
            </div>
        </div>
    ) : (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            style={style}
            {...rest}
            onError={handleError}
            loading="lazy"
        />
    )
}
