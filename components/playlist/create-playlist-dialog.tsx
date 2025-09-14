"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

interface CreatePlaylistDialogProps {
  onPlaylistCreated: () => void
}

export function CreatePlaylistDialog({ onPlaylistCreated }: CreatePlaylistDialogProps) {
  const [user] = useAuthState(auth)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleCreatePlaylist = async () => {
    if (!user) {
      alert("Please sign in to create playlists")
      return
    }

    if (!formData.name.trim()) {
      alert("Please enter a playlist name")
      return
    }

    try {
      setCreating(true)
      
      const playlistData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        cover: "",
        songs: [],
        createdBy: user.uid,
        createdAt: new Date(),
      }

      await addDoc(collection(db, "playlists"), playlistData)
      
      // Reset form and close dialog
      setFormData({ name: "", description: "" })
      setOpen(false)
      onPlaylistCreated()
      
    } catch (error) {
      console.error("Error creating playlist:", error)
      alert(`Failed to create playlist: ${error.message}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Playlist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new playlist to organize your favorite songs.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-white">
              Playlist Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter playlist name"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
              maxLength={50}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-white">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your playlist"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 resize-none"
              rows={3}
              maxLength={200}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePlaylist}
            disabled={creating || !formData.name.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 text-black"
          >
            {creating ? "Creating..." : "Create Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
