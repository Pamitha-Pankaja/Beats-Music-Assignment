"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNewReleases } from "@/hooks/use-music-data"
import { MusicCoverImage } from "@/components/ui/music-cover-image"
import { SongTextDisplay } from "@/components/ui/song-text-display"

export function NewReleasesCarousel() {
  const { songs, loading, error } = useNewReleases()
  const [showAll, setShowAll] = useState(false)
  
  // Show 8 by default, more when "See more" is clicked
  const displayedSongs = showAll ? songs : songs.slice(0, 8)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">US/UK Song New Releases</h3>
          <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300" disabled>
            See more
          </Button>
        </div>
        <div className="text-center text-gray-400 py-8">Loading new releases...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">US/UK Song New Releases</h3>
          <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300" disabled>
            See more
          </Button>
        </div>
        <div className="text-center text-red-400 py-8">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">US/UK Song New Releases</h3>
        {songs.length > 8 ? (
          <Button 
            variant="ghost" 
            className="text-cyan-400 hover:text-cyan-300"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : "See more"}
          </Button>
        ) : (
          <div></div>
        )}
      </div>

      {/* Single horizontal row layout */}
      <div className="relative">
        <div className={`flex space-x-6 pb-4 scroll-smooth ${
          showAll 
            ? "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" 
            : "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        }`}>
          {displayedSongs.map((release) => (
            <div key={release.id} className="flex-shrink-0 text-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 mx-auto border-2 border-orange-400 group-hover:border-cyan-400 transition-colors duration-200">
                <MusicCoverImage
                  src={release.cover}
                  alt={release.artist}
                  width={80}
                  height={80}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="w-20">
                <SongTextDisplay
                  title={release.title}
                  artist={release.artist}
                  titleClassName="text-white text-sm font-medium mb-1 truncate group-hover:text-cyan-400 transition-colors"
                  artistClassName="text-gray-400 text-xs truncate"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {displayedSongs.length === 0 && !loading && !error && (
        <div className="text-center text-gray-400 py-8">
          No new releases found
        </div>
      )}
    </div>
  )
}
