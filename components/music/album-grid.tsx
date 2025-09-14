"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNewReleases } from "@/hooks/use-music-data"
import { MusicCoverImage } from "@/components/ui/music-cover-image"
import { SongTextDisplay } from "@/components/ui/song-text-display"

export function AlbumGrid() {
  const { songs: newReleases, loading, error } = useNewReleases()
  const [showAll, setShowAll] = useState(false)
  
  // Show 8 songs by default, all when "See all" is clicked
  const displayedReleases = showAll ? newReleases : newReleases.slice(0, 8)

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-xl font-semibold">New Releases</h2>
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
          </div>
          <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 text-sm" disabled>
            See all
          </Button>
        </div>
        <div className="text-center text-gray-400 py-8">Loading new releases...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-xl font-semibold">New Releases</h2>
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
          </div>
          <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 text-sm" disabled>
            See all
          </Button>
        </div>
        <div className="text-center text-red-400 py-8">{error}</div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-xl font-semibold">New Releases</h2>
          <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
        </div>
        {newReleases.length > 8 ? (
          <Button 
            variant="ghost" 
            className="text-cyan-400 hover:text-cyan-300 text-sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : "See all"}
          </Button>
        ) : (
          <div></div>
        )}
      </div>

      {/* Horizontal Scrollable Row */}
      <div className="relative">
        <div className={`flex space-x-4 pb-4 scroll-smooth ${
          showAll 
            ? "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" 
            : "overflow-x-hidden"
        }`}>
          {displayedReleases.map((release) => (
            <Card
              key={release.id}
              className="flex-shrink-0 w-40 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            >
              <div className="p-3">
                <div className="relative mb-3 overflow-hidden rounded-lg">
                  <MusicCoverImage
                    src={release.cover}
                    alt={release.title}
                    width={140}
                    height={140}
                    className="aspect-square group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Hover overlay with play button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black rounded-full w-10 h-10 p-0">
                      ▶
                    </Button>
                  </div>
                </div>
                <SongTextDisplay
                  title={release.title}
                  artist={release.artist}
                  titleClassName="text-white text-sm font-medium truncate mb-1 group-hover:text-cyan-400 transition-colors"
                  artistClassName="text-gray-400 text-xs truncate"
                />
              </div>
            </Card>
          ))}
        </div>
        
        {/* Gradient fade effects for scroll indication - only show when scrollable */}
        {showAll && (
          <>
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Empty State */}
      {displayedReleases.length === 0 && !loading && !error && (
        <div className="text-center text-gray-400 py-8">
          No new releases found
        </div>
      )}
    </div>
  )
}
