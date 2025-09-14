"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { emailSignUp } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToPolicy: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToPolicy: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToPolicy) {
      toast({
        title: "Error",
        description: "Please agree to our policy to continue",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await emailSignUp(formData.email, formData.password, formData.username)
      toast({
        title: "Success",
        description: "Account created successfully!",
      })
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        name="username" 
        placeholder="Username" 
        value={formData.username} 
        onChange={handleInputChange} 
        required 
        className="h-11 bg-gray-800/40 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
        className="h-11 bg-gray-800/40 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
        className="h-11 bg-gray-800/40 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
      />
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        required
        className="h-11 bg-gray-800/40 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
      />

      <div className="flex items-center space-x-3 pt-1">
        <Checkbox 
          id="policy" 
          checked={formData.agreeToPolicy} 
          onCheckedChange={handleCheckboxChange}
          className="border-gray-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 rounded-sm"
        />
        <label htmlFor="policy" className="text-sm text-gray-300 cursor-pointer">
          Agree our policy
        </label>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-black font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create New Account"}
      </Button>
    </form>
  )
}
