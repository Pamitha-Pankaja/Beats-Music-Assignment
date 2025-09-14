"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Types for our data structures
export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  lyrics?: string[]
  genre?: string
  releaseDate?: Date
  isCurrentlyPlaying?: boolean
  playCount?: number
}

export interface FeaturedSong {
  id: string
  title: string
  artist: string
  cover: string
  backgroundImage: string
  lyrics: string[]
  duration: string
  currentTime: string
}

export interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  songs: string[]
  createdBy: string
  createdAt: Date
}

// Hook for fetching recently played songs
export function useRecentlyPlayedSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentlyPlayedSongs = async () => {
      try {
        setLoading(true)
        const songsRef = collection(db, "songs")
        const q = query(songsRef, orderBy("playCount", "desc"), limit(20))
        const snapshot = await getDocs(q)
        
        const songsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Song))
        
        setSongs(songsData)
      } catch (err) {
        console.error("Error fetching recently played songs:", err)
        setError("Failed to load recently played songs")
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyPlayedSongs()
  }, [])

  return { songs, loading, error }
}

// Hook for fetching top charts
export function useTopCharts() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopCharts = async () => {
      try {
        setLoading(true)
        const songsRef = collection(db, "songs")
        const q = query(songsRef, orderBy("playCount", "desc"), limit(20))
        const snapshot = await getDocs(q)
        
        const songsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Song))
        
        setSongs(songsData)
      } catch (err) {
        console.error("Error fetching top charts:", err)
        setError("Failed to load top charts")
      } finally {
        setLoading(false)
      }
    }

    fetchTopCharts()
  }, [])

  return { songs, loading, error }
}

// Hook for fetching new releases
export function useNewReleases() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true)
        const songsRef = collection(db, "songs")
        const q = query(songsRef, orderBy("releaseDate", "desc"), limit(20))
        const snapshot = await getDocs(q)
        
        const songsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Song))
        
        setSongs(songsData)
      } catch (err) {
        console.error("Error fetching new releases:", err)
        setError("Failed to load new releases")
      } finally {
        setLoading(false)
      }
    }

    fetchNewReleases()
  }, [])

  return { songs, loading, error }
}

// Hook for fetching featured song
export function useFeaturedSong() {
  const [featuredSong, setFeaturedSong] = useState<FeaturedSong | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedSong = async () => {
      try {
        setLoading(true)
        const featuredSongsRef = collection(db, "featuredSongs")
        const snapshot = await getDocs(featuredSongsRef)
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          const songData = {
            id: doc.id,
            ...doc.data()
          } as FeaturedSong
          
          setFeaturedSong(songData)
        }
      } catch (err) {
        console.error("Error fetching featured song:", err)
        setError("Failed to load featured song")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedSong()
  }, [])

  return { featuredSong, loading, error }
}

// Hook for fetching user playlists
export function useUserPlaylists(userId?: string) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaylists = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const playlistsRef = collection(db, "playlists")
      const q = query(playlistsRef, where("createdBy", "==", userId))
      const snapshot = await getDocs(q)
      
      const playlistsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Playlist))
      
      setPlaylists(playlistsData)
      setError(null)
      
    } catch (err) {
      console.error("Error fetching user playlists:", err)
      setError("Failed to load playlists")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [userId])

  // Return refresh function to allow manual refresh
  return { playlists, loading, error, refreshPlaylists: fetchPlaylists }
}
