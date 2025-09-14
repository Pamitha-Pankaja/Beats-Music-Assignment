"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { SidebarNavigation } from "@/components/layout/sidebar-navigation"
import { FeaturedSongPlayer } from "@/components/play/featured-song-player"
import { RecentlyPlayedList } from "@/components/play/recently-played-list"
import { TopCharts } from "@/components/play/top-charts"
import { NewReleasesCarousel } from "@/components/play/new-releases-carousel"
import { PlaylistsSection } from "@/components/play/playlists-section"

export default function PlayPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      // Navigate to search page with query
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header 
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search something ..."
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Featured Song & Recently Played */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Song Player */}
            <FeaturedSongPlayer />

            {/* Recently Played */}
            <RecentlyPlayedList />

            {/* New Releases Carousel */}
            <NewReleasesCarousel />
          </div>

          {/* Right Column - Top Charts & Playlists */}
          <div className="space-y-8">
            {/* Top Charts */}
            <TopCharts />

            {/* Playlists */}
            <PlaylistsSection />
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <SidebarNavigation />
    </div>
  )
}
