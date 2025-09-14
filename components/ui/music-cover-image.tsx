"use client"

import { useState } from "react"
import Image from "next/image"

interface MusicCoverImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

const fallbackImages = [
  "/images/album-red-taylor.png",
  "/images/album-need-to-know.png", 
  "/images/album-weeknd.png",
  "/images/album-hit-machine.png",
]

export function MusicCoverImage({ 
  src, 
  alt, 
  width = 140, 
  height = 140, 
  className = "",
  fallbackSrc
}: MusicCoverImageProps) {
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleError = () => {
    if (!imageError) {
      setImageError(true)
      // Try fallback first, then random fallback, then final placeholder
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
      } else if (currentSrc !== "/placeholder.svg") {
        // Use a random fallback image for variety
        const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
        setCurrentSrc(randomFallback)
      }
    }
  }

  // If no src provided or empty, use a random fallback immediately
  const finalSrc = !src || src === "" || src === "/placeholder.svg" 
    ? fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
    : currentSrc || src

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        onError={handleError}
        priority={false}
      />
    </div>
  )
}
