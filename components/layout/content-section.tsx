import Image from "next/image"

export function ContentSection() {
  return (
    <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
      <div className="max-w-2xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          THE MUTIL-UNIVERSAL MUSIC PLAYLIST
        </h1>

        <p className="text-gray-300 text-lg mb-12 leading-relaxed">
          Discover the magic of music with us. Our platform is your gateway to a world of melodies, rhythms, and
          emotions. Whether you're a passionate listener, a budding artist, or an industry professional, we have
          something special for you.
        </p>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="relative">
            <Image
              src="/images/coachella-festival.png"
              alt="Coachella Festival"
              width={400}
              height={300}
              className="rounded-2xl"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <h3 className="text-gray-400 text-sm font-medium mb-2">BUY TICKET</h3>
              <h2 className="text-white text-xl font-bold mb-4">TAKE YOUR TICKET FOR A WONDERFULL EXPERIENCE</h2>
            </div>

            <div className="mb-6">
              <Image src="/images/music-vibe-logo.png" alt="Music Vibe" width={200} height={60} className="mb-4" />
              <p className="text-gray-400 text-sm">JUST PAY FOR THE BEST 2024 COACHELLA PERFORMANCES</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
