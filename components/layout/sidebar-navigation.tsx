"use client"

import { Home, Search, Play, User, ListMusic, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigationItems = [
  { icon: Home, href: "/home", label: "Home" },
  { icon: Play, href: "/play", label: "Play Music" },
  { icon: Search, href: "/search", label: "Search" },
  { icon: ListMusic, href: "/library", label: "My Library" },
  { icon: User, href: "/profile", label: "Profile" },
  { icon: Settings, href: "/settings", label: "Settings" },
]

export function SidebarNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "p-3 rounded-full border border-gray-700 bg-black/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-800 hover:border-gray-600",
              isActive && "bg-cyan-500/20 border-cyan-500/50",
            )}
            title={item.label}
          >
            <Icon className={cn("w-5 h-5 text-gray-400 transition-colors", isActive && "text-cyan-400")} />
          </Link>
        )
      })}
    </div>
  )
}
