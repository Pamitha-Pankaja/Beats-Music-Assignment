require('dotenv').config({ path: '.env.local' })
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const newReleaseAlbums = [
  {
    title: "Red (Taylor's Version)",
    artist: "Taylor Swift",
    cover: "/images/album-red-taylor.png",
    duration: "3:45",
    category: "newRelease",
    releaseDate: new Date('2024-01-15'),
    genre: "Pop",
    album: "Red (Taylor's Version)"
  },
  {
    title: "Need To Know",
    artist: "Doja Cat", 
    cover: "/images/album-need-to-know.png",
    duration: "3:20",
    category: "newRelease",
    releaseDate: new Date('2024-01-10'),
    genre: "R&B",
    album: "Planet Her"
  },
  {
    title: "Save Your Tears",
    artist: "The Weeknd",
    cover: "/images/album-weeknd.png", 
    duration: "3:35",
    category: "newRelease",
    releaseDate: new Date('2024-01-08'),
    genre: "Pop",
    album: "After Hours"
  },
  {
    title: "HIT MACHINE",
    artist: "Soundwave",
    cover: "/images/album-hit-machine.png",
    duration: "4:12",
    category: "newRelease", 
    releaseDate: new Date('2024-01-05'),
    genre: "Electronic",
    album: "HIT MACHINE"
  },
  {
    title: "Cruel Summer",
    artist: "Taylor Swift",
    cover: "/images/album-red-taylor.png",
    duration: "2:58",
    category: "newRelease",
    releaseDate: new Date('2024-01-03'),
    genre: "Pop", 
    album: "Lover"
  },
  {
    title: "Woman",
    artist: "Doja Cat",
    cover: "/images/album-need-to-know.png",
    duration: "2:52",
    category: "newRelease",
    releaseDate: new Date('2024-01-02'),
    genre: "R&B",
    album: "Planet Her"  
  },
  {
    title: "Die For You",
    artist: "The Weeknd",
    cover: "/images/album-weeknd.png",
    duration: "4:20",
    category: "newRelease",
    releaseDate: new Date('2024-01-01'),
    genre: "Pop",
    album: "Starboy"
  },
  // Adding more songs to reach ~20 for scrolling effect
  {
    title: "Anti-Hero", 
    artist: "Taylor Swift",
    cover: "/images/album-red-taylor.png",
    duration: "3:20",
    category: "newRelease",
    releaseDate: new Date('2023-12-28'),
    genre: "Pop",
    album: "Midnights"
  },
  {
    title: "Paint The Town Red",
    artist: "Doja Cat",
    cover: "/images/album-need-to-know.png", 
    duration: "3:50",
    category: "newRelease",
    releaseDate: new Date('2023-12-25'),
    genre: "Hip Hop",
    album: "Scarlet"
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "/images/album-weeknd.png",
    duration: "3:20",
    category: "newRelease", 
    releaseDate: new Date('2023-12-20'),
    genre: "Synthwave",
    album: "After Hours"
  },
  {
    title: "Bass Drop",
    artist: "Soundwave", 
    cover: "/images/album-hit-machine.png",
    duration: "3:45",
    category: "newRelease",
    releaseDate: new Date('2023-12-18'),
    genre: "Electronic",
    album: "Electronic Vibes"
  },
  {
    title: "Lavender Haze",
    artist: "Taylor Swift",
    cover: "/images/album-red-taylor.png",
    duration: "3:22",
    category: "newRelease",
    releaseDate: new Date('2023-12-15'),
    genre: "Pop",
    album: "Midnights"
  },
  {
    title: "Kiss Me More",
    artist: "Doja Cat",
    cover: "/images/album-need-to-know.png",
    duration: "3:28",
    category: "newRelease", 
    releaseDate: new Date('2023-12-12'),
    genre: "R&B",
    album: "Planet Her"
  },
  {
    title: "Can't Feel My Face",
    artist: "The Weeknd",
    cover: "/images/album-weeknd.png",
    duration: "3:35",
    category: "newRelease",
    releaseDate: new Date('2023-12-10'),
    genre: "Pop",
    album: "Beauty Behind The Madness"
  },
  {
    title: "Neon Nights",
    artist: "Soundwave",
    cover: "/images/album-hit-machine.png", 
    duration: "4:05",
    category: "newRelease",
    releaseDate: new Date('2023-12-08'),
    genre: "Electronic",
    album: "Cyber Dreams"
  },
  {
    title: "Shake It Off",
    artist: "Taylor Swift", 
    cover: "/images/album-red-taylor.png",
    duration: "3:39",
    category: "newRelease",
    releaseDate: new Date('2023-12-05'),
    genre: "Pop",
    album: "1989"
  },
  {
    title: "Say So",
    artist: "Doja Cat",
    cover: "/images/album-need-to-know.png",
    duration: "3:57",
    category: "newRelease",
    releaseDate: new Date('2023-12-02'),
    genre: "Pop",
    album: "Hot Pink" 
  },
  {
    title: "Earned It",
    artist: "The Weeknd",
    cover: "/images/album-weeknd.png", 
    duration: "4:37",
    category: "newRelease",
    releaseDate: new Date('2023-12-01'),
    genre: "R&B",
    album: "Fifty Shades of Grey"
  },
  {
    title: "Electric Dreams",
    artist: "Soundwave",
    cover: "/images/album-hit-machine.png",
    duration: "3:18",
    category: "newRelease",
    releaseDate: new Date('2023-11-28'),
    genre: "Electronic", 
    album: "Future Sounds"
  },
  {
    title: "Love Story",
    artist: "Taylor Swift",
    cover: "/images/album-red-taylor.png",
    duration: "3:55", 
    category: "newRelease",
    releaseDate: new Date('2023-11-25'),
    genre: "Country Pop",
    album: "Fearless"
  }
]

async function addNewReleasesToFirebase() {
  try {
    console.log('🎵 Starting to add new releases to Firebase...')
    
    for (let i = 0; i < newReleaseAlbums.length; i++) {
      const song = newReleaseAlbums[i]
      
      // Clean song object to remove undefined values
      const cleanSong = Object.fromEntries(
        Object.entries(song).filter(([_, value]) => value !== undefined)
      )
      
      console.log(`📀 Adding song ${i + 1}/${newReleaseAlbums.length}: ${song.title} by ${song.artist}`)
      
      const docRef = await addDoc(collection(db, 'songs'), cleanSong)
      console.log(`✅ Added with ID: ${docRef.id}`)
    }
    
    console.log('🎉 All new releases added successfully!')
    
  } catch (error) {
    console.error('❌ Error adding new releases:', error)
    process.exit(1)
  }
}

addNewReleasesToFirebase()
