"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Music, Trash2 } from "lucide-react"
import { doc, updateDoc, arrayRemove, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PlaylistViewDialogProps {
  playlist: {
    id: string
    name: string
    description: string
    songs: string[]
  }
  trigger: React.ReactNode
  onPlaylistDeleted?: () => void
}

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
}

export function PlaylistViewDialog({ playlist, trigger, onPlaylistDeleted }: PlaylistViewDialogProps) {
  const [open, setOpen] = useState(false)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [removingSong, setRemovingSong] = useState<string | null>(null)
  const [deletingPlaylist, setDeletingPlaylist] = useState(false)

  // Fetch song details when dialog opens
  useEffect(() => {
    if (open && playlist.songs.length > 0) {
      fetchSongDetails()
    } else if (open) {
      setSongs([])
    }
  }, [open, playlist.songs])

  const fetchSongDetails = async () => {
    setLoading(true)
    try {
      const songPromises = playlist.songs.map(async (songId) => {
        const songDoc = await getDoc(doc(db, "songs", songId))
        if (songDoc.exists()) {
          return { id: songDoc.id, ...songDoc.data() } as Song
        }
        return null
      })

      const songResults = await Promise.all(songPromises)
      const validSongs = songResults.filter((song): song is Song => song !== null)
      setSongs(validSongs)
    } catch (error) {
      console.error("Error fetching song details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSong = async (songId: string) => {
    try {
      setRemovingSong(songId)
      
      // Remove the song from the playlist
      const playlistRef = doc(db, "playlists", playlist.id)
      await updateDoc(playlistRef, {
        songs: arrayRemove(songId)
      })
      
      // Update local state
      setSongs(songs.filter(song => song.id !== songId))
    } catch (error) {
      console.error("Error removing song from playlist:", error)
      alert("Failed to remove song from playlist. Please try again.")
    } finally {
      setRemovingSong(null)
    }
  }

  const handleDeletePlaylist = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`)
    
    if (!confirmDelete) return

    try {
      setDeletingPlaylist(true)
      
      // Delete the playlist document
      const playlistRef = doc(db, "playlists", playlist.id)
      await deleteDoc(playlistRef)
      
      // Close the dialog and notify parent
      setOpen(false)
      onPlaylistDeleted?.()
      
    } catch (error) {
      console.error("Error deleting playlist:", error)
      alert("Failed to delete playlist. Please try again.")
    } finally {
      setDeletingPlaylist(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-white">{playlist.name}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {playlist.description || "No description"}
                <span className="block mt-1">
                  {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                </span>
              </DialogDescription>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeletePlaylist}
              disabled={deletingPlaylist}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-4"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deletingPlaylist ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="max-h-[400px]">
          {loading && (
            <div className="text-center text-gray-400 py-8">Loading songs...</div>
          )}

          {!loading && songs.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>This playlist is empty</p>
              <p className="text-sm">Add some songs to get started!</p>
            </div>
          )}

          {!loading && songs.length > 0 && (
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="text-gray-400 w-6 text-center text-sm">
                      {index + 1}
                    </span>

                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={song.cover || "/placeholder.svg"}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{song.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    </div>

                    <div className="text-gray-400 text-sm hidden sm:block">
                      {song.duration}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSong(song.id)}
                      disabled={removingSong === song.id}
                      className="text-gray-400 hover:text-red-400"
                    >
                      {removingSong === song.id ? (
                        "..."
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
