"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { emailSignIn } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import { SocialLoginButtons } from "./social-login-buttons"

export function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await emailSignIn(formData.username, formData.password)
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account",
      })
      router.push("/home")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSuccess = () => {
    router.push("/home")
  }

  return (
    <div className="w-full">
      <div className="bg-gray-900/20 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Glad you're back !</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="h-12 bg-gray-800/40 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
            />
          </div>

          <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="h-12 bg-gray-800/40 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
              className="border-gray-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 rounded-sm"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-300">
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-black font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
              Forgot password ?
            </Link>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/20 text-gray-400">Or</span>
            </div>
          </div>

          <div className="mt-6">
            <SocialLoginButtons onSuccess={handleSocialSuccess} />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account ?{" "}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
              Signup
            </Link>
          </p>
        </div>

        <div className="mt-6 flex justify-center space-x-8 text-xs text-gray-500">
          <Link href="/terms" className="hover:text-gray-400 transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/support" className="hover:text-gray-400 transition-colors">
            Support
          </Link>
          <Link href="/customer-care" className="hover:text-gray-400 transition-colors">
            Customer Care
          </Link>
        </div>
      </div>
    </div>
  )
}
