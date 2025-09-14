"use client"

import { Header } from "@/components/layout/header"
import { SidebarNavigation } from "@/components/layout/sidebar-navigation"
import { SearchResults } from "@/components/search/search-results"
import { TopCharts } from "@/components/play/top-charts"
import { VerticalNewReleases } from "@/components/search/vertical-new-releases"
import { GlobalMusicPlayer } from "@/components/search/global-music-player"
import { useNewReleases } from "@/hooks/use-music-data"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <Header showSearch={false} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 lg:grid-cols-8 gap-6">
          {/* Left Column - Search Results */}
          <div className="xl:col-span-6 lg:col-span-4 col-span-1">
            <SearchResults />
          </div>

          {/* Center Column - Top Charts */}
          <div className="xl:col-span-4 lg:col-span-3 col-span-1">
            <TopCharts />
          </div>

          {/* Right Column - Vertical New Releases */}
          <div className="xl:col-span-2 lg:col-span-1 col-span-1 flex justify-end">
            <div className="w-full max-w-[140px] h-full">
              <VerticalNewReleases />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Responsive - Horizontal scroll for new releases */}
        <MobileNewReleases />
      </div>

      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Global Music Player */}
      <GlobalMusicPlayer />
    </div>
  )
}

// Mobile component for new releases
function MobileNewReleases() {
  const { songs: newReleases, loading } = useNewReleases()
  const mobileReleases = newReleases.slice(0, 8)

  if (loading || mobileReleases.length === 0) return null

  return (
    <div className="lg:hidden mt-8">
      <h3 className="text-white text-lg font-semibold mb-4">New Releases</h3>
      <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-4">
        <div className="flex space-x-4 px-2">
          {mobileReleases.map((release) => (
            <div key={release.id} className="flex-shrink-0 group cursor-pointer">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 group-hover:border-orange-400 transition-colors">
                <img
                  src={release.cover || "/placeholder.svg"}
                  alt={release.artist}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
