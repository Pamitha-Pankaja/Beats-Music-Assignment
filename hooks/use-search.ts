"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, query, where, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Song {
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

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null)

  const SONGS_PER_LOAD = 6

  // Search songs based on title or artist
  const searchSongs = useCallback(async (term: string, loadMore = false) => {
    if (!term.trim()) {
      // If no search term, show all songs
      await getAllSongs(loadMore)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const songsRef = collection(db, "songs")
      // Get all songs first, then filter client-side (Firebase has limited text search)
      const snapshot = await getDocs(songsRef)
      const results: Song[] = []

      // Filter results by search term (case insensitive)
      snapshot.docs.forEach(doc => {
        const data = doc.data() as Song
        const songData = { id: doc.id, ...data }
        
        // Check if title or artist contains search term (case insensitive)
        const titleMatch = data.title?.toLowerCase().includes(term.toLowerCase())
        const artistMatch = data.artist?.toLowerCase().includes(term.toLowerCase())
        
        if (titleMatch || artistMatch) {
          results.push(songData)
        }
      })

      // For search results, we'll show all matches (no pagination for simplicity)
      setSongs(results)
      setHasMore(false) // No pagination for search results
      setLastDoc(null)

    } catch (err) {
      console.error("❌ Error searching songs:", err)
      setError("Failed to search songs")
    } finally {
      setLoading(false)
    }
  }, [])

  // Get all songs when no search term
  const getAllSongs = useCallback(async (loadMore = false) => {
    try {
      setLoading(true)
      setError(null)

      const songsRef = collection(db, "songs")
      let q = query(songsRef, limit(SONGS_PER_LOAD))

      // Try without orderBy first to avoid index issues
      if (loadMore && lastDoc) {
        q = query(songsRef, startAfter(lastDoc), limit(SONGS_PER_LOAD))
      }

      const snapshot = await getDocs(q)
      const songsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Song))

      if (loadMore) {
        setSongs(prev => [...prev, ...songsData])
      } else {
        setSongs(songsData)
      }

      // Set lastDoc for pagination
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1])
        setHasMore(snapshot.docs.length === SONGS_PER_LOAD)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error("❌ Error fetching all songs:", err)
      setError("Failed to fetch songs")
    } finally {
      setLoading(false)
    }
  }, [])

  // Load more songs (for infinite scroll)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      if (searchTerm.trim()) {
        searchSongs(searchTerm, true)
      } else {
        getAllSongs(true)
      }
    }
  }, [loading, hasMore, searchTerm])

  // Handle search input change
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setLastDoc(null)
    setSongs([])
    setHasMore(true)
    
    if (term.trim()) {
      searchSongs(term, false)
    } else {
      getAllSongs(false)
    }
  }, [])

  // Initial load of all songs
  useEffect(() => {
    getAllSongs(false)
  }, [])

  return {
    searchTerm,
    songs,
    loading,
    error,
    hasMore,
    handleSearch,
    loadMore,
    setSearchTerm
  }
}
