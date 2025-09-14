"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

// Hook for managing individual song like status
export function useSongLike(songId: string) {
  const [user] = useAuthState(auth)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [likeDocId, setLikeDocId] = useState<string | null>(null)

  // Check if song is liked when component mounts or user/songId changes
  useEffect(() => {
    if (!user || !songId) {
      setIsLiked(false)
      setLikeDocId(null)
      return
    }

    const checkLikeStatus = async () => {
      try {
        const likesRef = collection(db, "likes")
        const q = query(
          likesRef,
          where("userId", "==", user.uid),
          where("songId", "==", songId)
        )
        
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          setIsLiked(true)
          setLikeDocId(snapshot.docs[0].id)
        } else {
          setIsLiked(false)
          setLikeDocId(null)
        }
      } catch (error) {
        console.error("Error checking like status:", error)
      }
    }

    checkLikeStatus()
  }, [user, songId])

  const toggleLike = async () => {
    if (!user) {
      alert("Please sign in to like songs")
      return
    }

    if (!songId) {
      console.error("No song ID provided")
      return
    }

    try {
      setLoading(true)

      if (isLiked && likeDocId) {
        // Unlike the song
        await deleteDoc(doc(db, "likes", likeDocId))
        setIsLiked(false)
        setLikeDocId(null)
      } else {
        // Like the song
        const likeData = {
          userId: user.uid,
          songId: songId,
          likedAt: new Date(),
        }
        
        const docRef = await addDoc(collection(db, "likes"), likeData)
        setIsLiked(true)
        setLikeDocId(docRef.id)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      alert("Failed to update like status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return { isLiked, loading, toggleLike }
}

// Hook for getting all liked songs for a user
export function useUserLikedSongs() {
  const [user] = useAuthState(auth)
  const [likedSongs, setLikedSongs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLikedSongs([])
      setLoading(false)
      return
    }

    const likesRef = collection(db, "likes")
    const q = query(likesRef, where("userId", "==", user.uid))

    // Use real-time listener for liked songs
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const songIds = snapshot.docs.map(doc => doc.data().songId)
        setLikedSongs(songIds)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error("Error fetching liked songs:", err)
        setError("Failed to load liked songs")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  return { likedSongs, loading, error }
}

// Hook for getting like count for a specific song (optional - for displaying like counts)
export function useSongLikeCount(songId: string) {
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!songId) {
      setLikeCount(0)
      setLoading(false)
      return
    }

    const fetchLikeCount = async () => {
      try {
        const likesRef = collection(db, "likes")
        const q = query(likesRef, where("songId", "==", songId))
        const snapshot = await getDocs(q)
        
        setLikeCount(snapshot.size)
      } catch (error) {
        console.error("Error fetching like count:", error)
        setLikeCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchLikeCount()
  }, [songId])

  return { likeCount, loading }
}
