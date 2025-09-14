"use client"

interface SongTextDisplayProps {
  title?: string
  artist?: string
  titleClassName?: string
  artistClassName?: string
  showDebug?: boolean
}

// Fallback data for testing
const fallbackSongs = [
  { title: "Red (Taylor's Version)", artist: "Taylor Swift" },
  { title: "Need To Know", artist: "Doja Cat" },
  { title: "Save Your Tears", artist: "The Weeknd" },
  { title: "HIT MACHINE", artist: "Soundwave" },
  { title: "Cruel Summer", artist: "Taylor Swift" },
  { title: "Woman", artist: "Doja Cat" },
  { title: "Die For You", artist: "The Weeknd" },
  { title: "Watermelon Sugar", artist: "Harry Styles" },
]

export function SongTextDisplay({ 
  title, 
  artist, 
  titleClassName = "text-white text-sm font-medium truncate mb-1",
  artistClassName = "text-gray-400 text-xs truncate",
  showDebug = false 
}: SongTextDisplayProps) {
  // If both title and artist are missing, use a random fallback
  const shouldUseFallback = (!title || title.trim() === "") && (!artist || artist.trim() === "")
  
  let displayTitle = title
  let displayArtist = artist
  
  if (shouldUseFallback) {
    const randomSong = fallbackSongs[Math.floor(Math.random() * fallbackSongs.length)]
    displayTitle = randomSong.title
    displayArtist = randomSong.artist
  } else {
    // Use fallbacks for individual missing fields
    displayTitle = title && title.trim() !== "" ? title : "Unknown Title"
    displayArtist = artist && artist.trim() !== "" ? artist : "Unknown Artist"
  }

  return (
    <div>
      <h4 className={titleClassName}>
        {displayTitle}
      </h4>
      <p className={artistClassName}>
        {displayArtist}
      </p>
      {showDebug && (
        <div className="text-xs text-yellow-400 mt-1">
          Debug: Original title="{title || 'empty'}", artist="{artist || 'empty'}"
          {shouldUseFallback && " [Using fallback]"}
        </div>
      )}
    </div>
  )
}
