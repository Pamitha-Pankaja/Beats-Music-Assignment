"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Check } from "lucide-react"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { useUserPlaylists } from "@/hooks/use-music-data"

interface AddToPlaylistDialogProps {
  songId: string
  songTitle: string
  trigger: React.ReactNode
}

export function AddToPlaylistDialog({ songId, songTitle, trigger }: AddToPlaylistDialogProps) {
  const [user] = useAuthState(auth)
  const { playlists, loading } = useUserPlaylists(user?.uid)
  const [open, setOpen] = useState(false)
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null)

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!user) {
      alert("Please sign in to add songs to playlists")
      return
    }

    try {
      setAddingToPlaylist(playlistId)
      
      // Update the playlist document to add the song ID to the songs array
      const playlistRef = doc(db, "playlists", playlistId)
      await updateDoc(playlistRef, {
        songs: arrayUnion(songId)
      })
      
      setOpen(false)
    } catch (error) {
      console.error("Error adding song to playlist:", error)
      alert("Failed to add song to playlist. Please try again.")
    } finally {
      setAddingToPlaylist(null)
    }
  }

  const getSongCount = (playlist: any) => {
    return playlist.songs?.length || 0
  }

  const isSongInPlaylist = (playlist: any) => {
    return playlist.songs?.includes(songId) || false
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add to Playlist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add "{songTitle}" to one of your playlists
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[300px]">
          {!user && (
            <div className="text-center text-gray-400 py-8">
              Please sign in to add songs to playlists
            </div>
          )}

          {user && loading && (
            <div className="text-center text-gray-400 py-8">Loading playlists...</div>
          )}

          {user && !loading && playlists.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No playlists found. Create your first playlist!
            </div>
          )}

          {user && !loading && playlists.length > 0 && (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {playlists.map((playlist) => {
                  const isInPlaylist = isSongInPlaylist(playlist)
                  const songCount = getSongCount(playlist)
                  const isAdding = addingToPlaylist === playlist.id

                  return (
                    <div
                      key={playlist.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-medium truncate">{playlist.name}</h4>
                          <p className="text-gray-400 text-sm">{songCount} songs</p>
                        </div>
                      </div>
                      
                      <Button
                        variant={isInPlaylist ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        disabled={isInPlaylist || isAdding}
                        className={
                          isInPlaylist 
                            ? "bg-green-600 hover:bg-green-700 text-white" 
                            : "bg-cyan-500 hover:bg-cyan-600 text-black"
                        }
                      >
                        {isAdding ? (
                          "Adding..."
                        ) : isInPlaylist ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Added
                          </>
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
