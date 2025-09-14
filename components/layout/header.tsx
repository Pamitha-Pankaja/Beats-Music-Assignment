"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useCallback } from "react"
import Image from "next/image"

export interface HeaderProps {
  /** Whether to show the search input */
  showSearch?: boolean
  /** Callback for search input events */
  onSearch?: (query: string) => void
  /** Placeholder text for search input */
  searchPlaceholder?: string
  /** Custom className for the header */
  className?: string
}

export function Header({ 
  showSearch = false, 
  onSearch, 
  searchPlaceholder = "Search something ...",
  className = "" 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }, [onSearch])

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(searchQuery)
    }
  }, [onSearch, searchQuery])

  return (
    <header 
      className={`border-b border-gray-800 bg-black ${className}`}
      role="banner"
      aria-label="Site header"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/images/logos_opensearch-icon.png"
              alt="Beats Music Logo"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="text-white font-bold text-lg">BEATS MUSIC</span>
          </div>

          {/* Search Section - Only show if showSearch is true */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-8 hidden sm:block">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  placeholder={searchPlaceholder}
                  className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                  aria-label="Search music"
                />
              </div>
            </div>
          )}

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <img 
              src="/images/afterpay-logo.png" 
              alt="Afterpay" 
              className="h-6 w-auto"
              loading="lazy"
            />
            <img 
              src="/images/zip-logo.png" 
              alt="Zip" 
              className="h-6 w-auto"
              loading="lazy"
            />
          </div>
        </div>

        {/* Mobile Search - Show below header on small screens */}
        {showSearch && (
          <div className="mt-4 sm:hidden">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                aria-hidden="true"
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                placeholder={searchPlaceholder}
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                aria-label="Search music"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
