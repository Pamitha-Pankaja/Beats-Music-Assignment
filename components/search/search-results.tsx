"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MoreHorizontal, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/hooks/use-search"
import { LikeButton } from "@/components/ui/like-button"
import { AddToPlaylistDialog } from "@/components/playlist/add-to-playlist-dialog"
import { MusicCoverImage } from "@/components/ui/music-cover-image"
import { SongTextDisplay } from "@/components/ui/song-text-display"

export function SearchResults() {
  const { songs, loading, error, hasMore, handleSearch, loadMore, searchTerm } = useSearch()
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Debounced search function
  const debouncedSearch = useCallback((term: string) => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Show typing indicator
    setIsTyping(true)

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      handleSearch(term)
      setIsTyping(false) // Hide typing indicator after search
    }, 300) // Wait 300ms after user stops typing
  }, [handleSearch])

  // Handle input change with real-time search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value) // Trigger search as user types
  }

  // Handle search button click
  const handleSearchInput = () => {
    handleSearch(inputValue)
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchInput()
    }
  }

  // Infinite scroll functionality
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100
    
    if (bottom && hasMore && !loading) {
      loadMore()
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      setIsTyping(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          {searchTerm ? `Search Results for "${searchTerm}"` : "All Songs"}
        </h3>
        <div className="flex space-x-2">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black">
            New
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
            Global
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search songs or artists..."
          className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 pr-12"
        />
        <Button 
          size="sm" 
          onClick={handleSearchInput}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2"
        >
          <Search className="w-4 h-4" />
        </Button>
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="absolute -bottom-6 left-0 text-xs text-cyan-400 animate-pulse">
            Searching...
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center text-red-400 py-4">{error}</div>
      )}

      {/* Results */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {songs.map((song, index) => (
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

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-400 py-4">
            {songs.length === 0 ? "Loading songs..." : "Loading more songs..."}
          </div>
        )}

        {/* No More Results */}
        {!loading && !hasMore && songs.length > 0 && (
          <div className="text-center text-gray-400 py-4">No more songs to load</div>
        )}

        {/* No Results */}
        {!loading && songs.length === 0 && searchTerm && (
          <div className="text-center text-gray-400 py-8">
            No songs found for "{searchTerm}". Try searching for something else.
          </div>
        )}

        {/* Empty State */}
        {!loading && songs.length === 0 && !searchTerm && (
          <div className="text-center text-gray-400 py-8">
            No songs available. Add some songs to your database!
          </div>
        )}
      </div>
    </div>
  )
}
