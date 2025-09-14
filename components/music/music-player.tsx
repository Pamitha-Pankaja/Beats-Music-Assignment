"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MusicPlayerProps {
  currentSong?: {
    title: string
    artist: string
    cover?: string
  }
}

export function MusicPlayer({ currentSong }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(45)

  const song = currentSong || {
    title: "ONE OF THE GIRLS",
    artist: "The Weeknd, JENNIE & Lily Rose Depp",
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
      <div className="text-center mb-4">
        <h3 className="text-white font-semibold text-lg mb-1">NEW SONG: {song.title}</h3>
        <p className="text-gray-400 text-sm">{song.artist}</p>
      </div>

      {/* Heart-shaped waveform visualization */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <Image
            src="/images/heart-waveform.png"
            alt="Heart waveform"
            width={180}
            height={100}
            className="opacity-80"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div className="bg-white rounded-full h-1 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="sm" className="text-white hover:text-cyan-400 hover:bg-gray-800">
          <Rewind className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="sm" className="text-white hover:text-cyan-400 hover:bg-gray-800">
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="text-white hover:text-cyan-400 hover:bg-gray-800 p-3"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>

        <Button variant="ghost" size="sm" className="text-white hover:text-cyan-400 hover:bg-gray-800">
          <SkipForward className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="sm" className="text-white hover:text-cyan-400 hover:bg-gray-800">
          <FastForward className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
