"use client"

import { Header } from "@/components/layout/header"
import { RegisterForm } from "@/components/auth/register-form"
import { SocialLoginButtons } from "@/components/auth/social-login-buttons"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()

  const handleRegistrationSuccess = () => {
    router.push("/home")
  }

  const handleSocialSuccess = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-gray-900/20 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Open New Account</h1>
              <p className="text-gray-400 text-sm">Enjoy your new spirit world</p>
            </div>

            <RegisterForm onSuccess={handleRegistrationSuccess} />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Do you have account ?{" "}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Login
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/20 text-gray-400">Or</span>
                </div>
              </div>

              <div className="mt-4">
                <SocialLoginButtons onSuccess={handleSocialSuccess} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
