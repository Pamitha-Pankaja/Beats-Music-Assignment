"use client"

import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRecentlyPlayedSongs } from "@/hooks/use-music-data"
import { AddToPlaylistDialog } from "@/components/playlist/add-to-playlist-dialog"
import { LikeButton } from "@/components/ui/like-button"
import { MusicCoverImage } from "@/components/ui/music-cover-image"
import { SongTextDisplay } from "@/components/ui/song-text-display"

export function RecentlyPlayedList() {
  const { songs, loading, error } = useRecentlyPlayedSongs()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-semibold text-white">Recently Played</h3>
          <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">i</span>
          </div>
        </div>
        <div className="text-center text-gray-400 py-8">Loading songs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-semibold text-white">Recently Played</h3>
          <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">i</span>
          </div>
        </div>
        <div className="text-center text-red-400 py-8">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h3 className="text-xl font-semibold text-white">Recently Played</h3>
        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
          <span className="text-black text-xs font-bold">i</span>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-gray-400 w-6 text-center">{index + 1}</span>

            <MusicCoverImage
              src={song.cover}
              alt={song.title}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <SongTextDisplay
                title={song.title}
                artist={song.artist}
                titleClassName={`font-medium truncate ${song.isCurrentlyPlaying ? "text-cyan-400" : "text-white"}`}
                artistClassName="text-gray-400 text-sm truncate"
              />
            </div>

            <div className="text-gray-400 text-sm hidden sm:block">{song.album}</div>

            <div className="text-gray-400 text-sm">{song.duration}</div>

            <div className="flex items-center space-x-2">
              <LikeButton songId={song.id} />
              <AddToPlaylistDialog
                songId={song.id}
                songTitle={song.title}
                trigger={
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Plus className="w-4 h-4" />
              </Button>
                }
              />
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
