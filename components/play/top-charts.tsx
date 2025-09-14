"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddToPlaylistDialog } from "@/components/playlist/add-to-playlist-dialog"
import { LikeButton } from "@/components/ui/like-button"
import { MusicCoverImage } from "@/components/ui/music-cover-image"
import { SongTextDisplay } from "@/components/ui/song-text-display"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  genre?: string
  releaseDate?: Date
  playCount?: number
}

type ChartType = 'new' | 'global'

export function TopCharts() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeChart, setActiveChart] = useState<ChartType>('new')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const displayedSongs = isExpanded ? songs : songs.slice(0, 7)

  // Fetch songs based on chart type
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setLoading(true)
        setError(null)
        const songsRef = collection(db, "songs")
        
        let q
        if (activeChart === 'new') {
          // For "New" - order by release date (newest first)
          q = query(songsRef, orderBy("releaseDate", "desc"), limit(20))
        } else {
          // For "Global" - order by play count (highest first) 
          try {
            q = query(songsRef, orderBy("playCount", "desc"), limit(20))
          } catch {
            // Fallback if playCount field doesn't exist on all documents
            q = query(songsRef, limit(20))
          }
        }
        
        const snapshot = await getDocs(q)
        let songsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Song))
        
        // If global chart and we had to use fallback query, sort client-side by playCount
        if (activeChart === 'global' && songsData.some(song => song.playCount)) {
          songsData.sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        }
        
        setSongs(songsData)
      } catch (err) {
        console.error("Error fetching charts:", err)
        setError("Failed to load charts")
      } finally {
        setLoading(false)
      }
    }

    fetchCharts()
  }, [activeChart])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Top 100 Global Songs</h3>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className={activeChart === 'new' 
                ? "bg-cyan-500 hover:bg-cyan-600 text-black" 
                : "border border-gray-600 text-gray-300 bg-transparent"}
              onClick={() => setActiveChart('new')}
              disabled={loading}
            >
              New
            </Button>
            <Button 
              size="sm" 
              className={activeChart === 'global' 
                ? "bg-cyan-500 hover:bg-cyan-600 text-black" 
                : "border border-gray-600 text-gray-300 bg-transparent"}
              onClick={() => setActiveChart('global')}
              disabled={loading}
            >
              Global
            </Button>
          </div>
        </div>
        <div className="text-center text-gray-400 py-8">Loading charts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Top 100 Global Songs</h3>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className={activeChart === 'new' 
                ? "bg-cyan-500 hover:bg-cyan-600 text-black" 
                : "border border-gray-600 text-gray-300 bg-transparent"}
              onClick={() => setActiveChart('new')}
            >
              New
            </Button>
            <Button 
              size="sm" 
              className={activeChart === 'global' 
                ? "bg-cyan-500 hover:bg-cyan-600 text-black" 
                : "border border-gray-600 text-gray-300 bg-transparent"}
              onClick={() => setActiveChart('global')}
            >
              Global
            </Button>
          </div>
        </div>
        <div className="text-center text-red-400 py-8">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Top 100 {activeChart === 'new' ? 'New' : 'Global'} Songs
        </h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className={activeChart === 'new' 
              ? "bg-cyan-500 hover:bg-cyan-600 text-black" 
              : "border border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800"}
            onClick={() => setActiveChart('new')}
          >
            New
          </Button>
          <Button 
            size="sm" 
            className={activeChart === 'global' 
              ? "bg-cyan-500 hover:bg-cyan-600 text-black" 
              : "border border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800"}
            onClick={() => setActiveChart('global')}
          >
            Global
          </Button>
        </div>
      </div>

      <div
        className={`space-y-2 ${isExpanded ? "max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" : ""}`}
      >
        {displayedSongs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-gray-400 w-6 text-center font-medium">{index + 1}</span>

            <MusicCoverImage
              src={song.cover}
              alt={song.title}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <SongTextDisplay
                title={song.title}
                artist={song.artist}
                titleClassName="font-medium text-white truncate"
                artistClassName="text-gray-400 text-sm truncate"
              />
            </div>

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

      <Button
        variant="ghost"
        className="text-gray-400 hover:text-white w-full"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Collapse ∧" : "Expand ∨"}
      </Button>
    </div>
  )
}
