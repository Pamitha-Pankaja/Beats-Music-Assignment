// This script populates your Firebase Firestore with sample music data
// Run this with: node scripts/populate-sample-data.js
// Make sure your Firebase environment variables are set in .env.local

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore')

// Debug: Check if environment variables are loaded
console.log('Loading Firebase config...')
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Found' : 'Missing')
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Found' : 'Missing')

// Initialize Firebase (make sure your .env.local has the Firebase config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if all required config is present
const missingConfig = Object.entries(firebaseConfig).filter(([key, value]) => !value)
if (missingConfig.length > 0) {
  console.error('Missing Firebase configuration:', missingConfig.map(([key]) => key))
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample songs data
const sampleSongs = [
  {
    title: "All I Want For Christmas Is You",
    artist: "Mariah Carey",
    album: "Merry Christmas",
    duration: "3:54",
    cover: "/images/recently-played-1.png",
    genre: "Pop",
    releaseDate: new Date('1994-11-01'),
    playCount: 150,
    isCurrentlyPlaying: false,
  },
  {
    title: "One of the girls",
    artist: "The Weeknd & JENNIE & Lily Rose Depp",
    album: "-R-",
    duration: "3:54",
    cover: "/images/recently-played-2.png",
    genre: "Pop",
    releaseDate: new Date('2023-12-08'),
    playCount: 200,
    isCurrentlyPlaying: true,
  },
  {
    title: "Donda",
    artist: "Kanye West",
    album: "Donda",
    duration: "3:54",
    cover: "/images/recently-played-3.png",
    genre: "Hip-Hop",
    releaseDate: new Date('2021-08-29'),
    playCount: 180,
    isCurrentlyPlaying: false,
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "/images/recently-played-4.png",
    genre: "Pop",
    releaseDate: new Date('2019-11-29'),
    playCount: 250,
    isCurrentlyPlaying: false,
  },
  {
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    cover: "/images/recently-played-1.png",
    genre: "Pop",
    releaseDate: new Date('2019-12-13'),
    playCount: 190,
    isCurrentlyPlaying: false,
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    cover: "/images/recently-played-2.png",
    genre: "Pop",
    releaseDate: new Date('2020-03-27'),
    playCount: 220,
    isCurrentlyPlaying: false,
  },
  {
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    cover: "/images/recently-played-3.png",
    genre: "Pop Rock",
    releaseDate: new Date('2021-05-14'),
    playCount: 160,
    isCurrentlyPlaying: false,
  },
  {
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3",
    duration: "2:21",
    cover: "/images/recently-played-4.png",
    genre: "Pop",
    releaseDate: new Date('2021-07-09'),
    playCount: 175,
    isCurrentlyPlaying: false,
  },
  {
    title: "Industry Baby",
    artist: "Lil Nas X & Jack Harlow",
    album: "MONTERO",
    duration: "3:32",
    cover: "/images/recently-played-1.png",
    genre: "Hip-Hop",
    releaseDate: new Date('2021-07-23'),
    playCount: 210,
    isCurrentlyPlaying: false,
  },
  {
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:58",
    cover: "/images/recently-played-2.png",
    genre: "Alternative",
    releaseDate: new Date('2020-06-29'),
    playCount: 185,
    isCurrentlyPlaying: false,
  },
]

// Sample featured song
const sampleFeaturedSong = {
  title: "ONE OF THE GIRL",
  artist: "The Weeknd & JENNIE & Lily Rose Depp",
  cover: "/images/featured-song-bg.png",
  backgroundImage: "/images/featured-song-bg.png",
  lyrics: [
    "Look me up and throw away the key",
    "He knows how to get the best out of me",
    "I'm no force for the world to see",
    "Trade my whole life just to be",
    "Tell nobody I control you"
  ],
  duration: "3:27",
  currentTime: "2:45"
}

// Sample playlists (you'll need to replace 'USER_ID_HERE' with actual user IDs)
const samplePlaylists = [
  {
    name: "For workplace",
    description: "Rich Brian's collections",
    cover: "",
    songs: [], // You can add song IDs here after creating songs
    createdBy: "USER_ID_HERE", // Replace with actual user ID
    createdAt: new Date()
  },
  {
    name: "deep focus",
    description: "Music for deep concentration",
    cover: "",
    songs: [],
    createdBy: "USER_ID_HERE", // Replace with actual user ID
    createdAt: new Date()
  }
]

async function populateData() {
  try {
    console.log('Starting to populate Firebase with sample data...')
    
    // Add songs one by one with better error handling
    console.log('Adding songs...')
    const songIds = []
    for (let i = 0; i < sampleSongs.length; i++) {
      const song = sampleSongs[i]
      try {
        // Clean song object to remove any undefined values
        const cleanSong = Object.fromEntries(
          Object.entries(song).filter(([_, value]) => value !== undefined)
        )
        
        const docRef = await addDoc(collection(db, 'songs'), cleanSong)
        songIds.push(docRef.id)
        console.log(`✅ Added song ${i + 1}/${sampleSongs.length}: ${song.title}`)
      } catch (songError) {
        console.error(`❌ Failed to add song: ${song.title}`, songError.message)
      }
    }
    
    // Add featured song
    console.log('Adding featured song...')
    try {
      const cleanFeaturedSong = Object.fromEntries(
        Object.entries(sampleFeaturedSong).filter(([_, value]) => value !== undefined)
      )
      
      await addDoc(collection(db, 'featuredSongs'), cleanFeaturedSong)
      console.log(`✅ Added featured song: ${sampleFeaturedSong.title}`)
    } catch (featuredError) {
      console.error('❌ Failed to add featured song:', featuredError.message)
    }
    
    console.log('✅ Sample data population completed!')
    console.log(`Successfully added ${songIds.length} songs`)
    
  } catch (error) {
    console.error('❌ Error populating data:', error.message)
    console.error('Full error:', error)
  }
}

// Run the script
if (require.main === module) {
  populateData().then(() => {
    console.log('Script finished')
    process.exit(0)
  }).catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
}

module.exports = { populateData }
