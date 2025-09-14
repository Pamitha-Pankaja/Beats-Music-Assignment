"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { SidebarNavigation } from "@/components/layout/sidebar-navigation"
import { MusicPlayer } from "@/components/music/music-player"
import { AlbumGrid } from "@/components/music/album-grid"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // TODO: Implement search functionality
    console.log("Searching for:", query)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with search */}
      <Header 
        showSearch={true} 
        onSearch={handleSearch}
        searchPlaceholder="Search something ..."
      />

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Hero section */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left content */}
            <div className="flex-1 space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  THE MUTIL-UNIVERSAL
                  <br />
                  MUSIC PLAYLIST
                </h1>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Discover the magic of music with us. Our platform is your gateway to a world of melodies, rhythms, and
                  emotions. Whether you're a passionate listener, a budding artist, or an industry professional, we have
                  something special for you.
                </p>
              </div>
            </div>

            {/* Right content - Music Player */}
            <div className="flex justify-center lg:justify-end">
              <MusicPlayer />
            </div>
          </div>

          <div className="w-full">
            <AlbumGrid />
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <SidebarNavigation />
    </div>
  )
}
