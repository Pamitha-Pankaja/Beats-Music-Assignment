"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = "Search something ...", className }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 ${className}`}
      />
    </div>
  )
}
