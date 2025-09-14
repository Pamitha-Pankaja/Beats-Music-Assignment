"use client"

import { useState } from "react"
import { useNewReleases } from "@/hooks/use-music-data"
import { Button } from "@/components/ui/button"
import { MusicCoverImage } from "@/components/ui/music-cover-image"
import { SongTextDisplay } from "@/components/ui/song-text-display"

export function VerticalNewReleases() {
  const { songs: newReleases, loading, error } = useNewReleases()
  const [showAll, setShowAll] = useState(false)
  
  // Show 5 by default, 12 when "See more" is clicked
  const displayedReleases = showAll ? newReleases.slice(0, 12) : newReleases.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center h-full max-h-[600px]">
        <div className="flex flex-col items-center space-y-4 px-4">
          <div className="flex justify-center mb-6">
            <Button variant="ghost" size="sm" className="text-gray-400 text-xs px-2 py-1" disabled>
              See more
            </Button>
          </div>
          <div className="text-center text-gray-400 text-xs">Loading...</div>
        </div>
        <div className="pl-6 flex items-center justify-center h-full min-h-[400px]">
          <div 
            className="text-gray-400/60 text-sm font-medium tracking-widest whitespace-nowrap"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)'
            }}
          >
            US/UK Song New Releases
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center h-full max-h-[600px]">
        <div className="flex flex-col items-center space-y-4 px-4">
          <div className="flex justify-center mb-6">
            <Button variant="ghost" size="sm" className="text-gray-400 text-xs px-2 py-1" disabled>
              See more
            </Button>
          </div>
          <div className="text-center text-red-400 text-xs">{error}</div>
        </div>
        <div className="pl-6 flex items-center justify-center h-full min-h-[400px]">
          <div 
            className="text-gray-400/60 text-sm font-medium tracking-widest whitespace-nowrap"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)'
            }}
          >
            US/UK Song New Releases
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start h-full max-h-[600px]">
      {/* Avatar List Column */}
      <div className="flex flex-col px-4">
        {/* See more button at top - only show if there are more than 5 songs */}
        {newReleases.length > 5 ? (
          <div className="flex justify-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white text-xs px-2 py-1"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : "See more"}
            </Button>
          </div>
        ) : (
          <div className="mb-6"></div>
        )}

        {/* Conditionally Scrollable Artist circles arranged vertically */}
        <div className={`flex flex-col items-center space-y-6 pr-2 ${
          showAll 
            ? "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent max-h-[400px]" 
            : "overflow-hidden"
        }`}>
          {displayedReleases.map((release) => (
            <div key={release.id} className="flex flex-col items-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 group-hover:border-orange-400 transition-colors duration-200">
                <MusicCoverImage
                  src={release.cover}
                  alt={release.artist}
                  width={64}
                  height={64}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              {/* Song and Artist Labels */}
              <div className="text-center mt-2 space-y-1 max-w-[80px]">
                <SongTextDisplay
                  title={release.title}
                  artist={release.artist}
                  titleClassName="text-white text-xs font-medium truncate group-hover:text-orange-400 transition-colors"
                  artistClassName="text-gray-400 text-xs truncate"
                  showDebug={false}
                />
              </div>
            </div>
          ))}
          
          {/* Add some extra spacing at bottom for better scrolling */}
          <div className="h-4"></div>
        </div>

        {/* Empty State */}
        {displayedReleases.length === 0 && (
          <div className="text-center text-gray-400 text-xs">No new releases</div>
        )}
      </div>

      {/* Vertical Text Label on the Right */}
      <div className="pl-6 flex items-center justify-center h-full min-h-[400px]">
        <div 
          className="text-gray-400/60 text-sm font-medium tracking-widest whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)'
          }}
        >
          US/UK Song New Releases
        </div>
      </div>
    </div>
  )
}
