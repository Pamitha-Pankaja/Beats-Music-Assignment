"use client"

import { BarChart3 } from "lucide-react"
import { useUserPlaylists } from "@/hooks/use-music-data"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { CreatePlaylistDialog } from "@/components/playlist/create-playlist-dialog"
import { PlaylistViewDialog } from "@/components/playlist/playlist-view-dialog"

export function PlaylistsSection() {
  const [user] = useAuthState(auth)
  const { playlists, loading, error, refreshPlaylists } = useUserPlaylists(user?.uid)

  const handlePlaylistCreated = () => {
    refreshPlaylists()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-semibold text-white">Your PlayLists</h3>
        </div>
        <CreatePlaylistDialog onPlaylistCreated={handlePlaylistCreated} />
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-4">Loading playlists...</div>
      )}

      {error && (
        <div className="text-center text-red-400 py-4">{error}</div>
      )}

      {!user && (
        <div className="text-center text-gray-400 py-4">Sign in to see your playlists</div>
      )}

      {user && playlists.length === 0 && !loading && (
        <div className="text-center text-gray-400 py-4">No playlists found. Create your first playlist!</div>
      )}

      <div className="space-y-4">
        {playlists.map((playlist) => (
          <PlaylistViewDialog
            key={playlist.id}
            playlist={playlist}
            onPlaylistDeleted={refreshPlaylists}
            trigger={
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{playlist.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {playlist.description || `${playlist.songs?.length || 0} songs`}
                  </p>
                </div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  )
}
