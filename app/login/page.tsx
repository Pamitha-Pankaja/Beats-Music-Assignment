import { Header } from "@/components/layout/header"
import { LoginForm } from "@/components/auth/login-form"
import { ContentSection } from "@/components/layout/content-section"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 min-h-[calc(100vh-120px)]">
          {/* Left Column - Content */}
          <div className="lg:col-span-7 xl:col-span-8 flex items-center">
            <ContentSection />
          </div>

          {/* Right Column - Login Form */}
          <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
