"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Play, Pause, SkipBack, SkipForward, Shuffle } from "lucide-react"
import { useFeaturedSong } from "@/hooks/use-music-data"
import { AddToPlaylistDialog } from "@/components/playlist/add-to-playlist-dialog"
import { LikeButton } from "@/components/ui/like-button"

export function FeaturedSongPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const { featuredSong, loading, error } = useFeaturedSong()

  if (loading) {
    return (
      <div className="relative h-[400px] bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-400">Loading featured song...</div>
      </div>
    )
  }

  if (error || !featuredSong) {
    return (
      <div className="relative h-[400px] bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-center text-red-400">{error || "No featured song available"}</div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-2xl"
        style={{ backgroundImage: `url(${featuredSong.backgroundImage || "/images/featured-song-bg.png"})` }}
      >
        <div className="absolute inset-0 bg-black/60 rounded-2xl" />
      </div>

      {/* Content */}
      <div className="relative p-8 h-[400px] flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="text-sm text-gray-300 mb-2">FEATURED SONGS</div>
          <h2 className="text-3xl font-bold text-white mb-2">{featuredSong.title}</h2>
          <p className="text-lg text-gray-300">{featuredSong.artist}</p>
        </div>

        {/* Lyrics Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            {featuredSong.lyrics?.map((line, index) => (
              <p key={index} className={`text-lg ${index === 1 ? "text-red-400 font-medium" : "text-white"}`}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <span>{featuredSong.currentTime || "0:00"}</span>
            <div className="flex-1 bg-gray-600 rounded-full h-1">
              <div className="bg-white rounded-full h-1 w-2/3"></div>
            </div>
            <span>{featuredSong.duration || "0:00"}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
              <LikeButton 
                songId={featuredSong.id} 
                className="text-white hover:text-red-400"
                size="sm"
              />
              <AddToPlaylistDialog
                songId={featuredSong.id}
                songTitle={featuredSong.title}
                trigger={
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-black px-6">
                    Add Playlist
                  </Button>
                }
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-gray-300"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
