"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSongLike } from "@/hooks/use-song-likes"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  songId: string
  className?: string
  size?: "sm" | "default" | "lg"
  showLikeCount?: boolean
}

export function LikeButton({ songId, className, size = "sm", showLikeCount = false }: LikeButtonProps) {
  const { isLiked, loading, toggleLike } = useSongLike(songId)

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleLike}
      disabled={loading}
      className={cn(
        "transition-colors",
        isLiked 
          ? "text-red-500 hover:text-red-400" 
          : className || "text-gray-400 hover:text-white"
      )}
    >
      <Heart 
        className={cn(
          "w-4 h-4",
          isLiked && "fill-current"
        )} 
      />
    </Button>
  )
}
