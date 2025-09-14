import { Header } from "@/components/layout/header"
import { SidebarNavigation } from "@/components/layout/sidebar-navigation"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-white mb-4">My Profile</h1>
          <p className="text-gray-400 text-lg mb-8">
            Manage your account settings and preferences.
          </p>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-gray-500">
              👤 Coming Soon
            </div>
          </div>
        </div>
      </main>

      <SidebarNavigation />
    </div>
  )
}
