"use client"

import { MoreHorizontal, Pause, SkipBack, SkipForward, Shuffle, Repeat, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFeaturedSong } from "@/hooks/use-music-data"
import { LikeButton } from "@/components/ui/like-button"
import { AddToPlaylistDialog } from "@/components/playlist/add-to-playlist-dialog"
import { useState } from "react"

export function GlobalMusicPlayer() {
  const { featuredSong, loading } = useFeaturedSong()
  const [isPlaying, setIsPlaying] = useState(true)

  // Don't render if loading or no featured song
  if (loading || !featuredSong) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1">
          <div className="w-full bg-gray-700 h-full">
            <div className="bg-red-500 h-full" style={{ width: "35%" }}></div>
          </div>
        </div>

        {/* Left - Song Info */}
        <div className="flex items-center space-x-4">
          <div className="text-left">
            <h4 className="text-white font-medium">{featuredSong.title}</h4>
            <p className="text-gray-400 text-sm">{featuredSong.artist}</p>
          </div>
        </div>

        {/* Center - Controls */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Shuffle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button 
            size="sm" 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <SkipForward className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Repeat className="w-5 h-5" />
          </Button>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">{featuredSong.currentTime || "0:00"}</span>
          <span className="text-gray-400 text-sm">{featuredSong.duration || "0:00"}</span>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
          <LikeButton songId={featuredSong.id} className="text-gray-400 hover:text-white" />
          <AddToPlaylistDialog
            songId={featuredSong.id}
            songTitle={featuredSong.title}
            trigger={
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black">
                Add Playlist
              </Button>
            }
          />
        </div>
      </div>
    </div>
  )
}
