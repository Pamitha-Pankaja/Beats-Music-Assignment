"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { googleSignIn, githubSignIn, facebookSignIn } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

interface SocialLoginButtonsProps {
  onSuccess?: () => void
}

export function SocialLoginButtons({ onSuccess }: SocialLoginButtonsProps) {
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
      toast({
        title: "Success",
        description: "Successfully signed in with Google",
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      })
    }
  }

  const handleGithubSignIn = async () => {
    try {
      await githubSignIn()
      toast({
        title: "Success",
        description: "Successfully signed in with GitHub",
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with GitHub",
        variant: "destructive",
      })
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn()
      toast({
        title: "Success",
        description: "Successfully signed in with Facebook",
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Facebook",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
        onClick={handleGoogleSignIn}
      >
        <Image src="/images/google-logo.png" alt="Google" width={24} height={24} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700"
        onClick={handleFacebookSignIn}
      >
        <Image src="/images/facebook-logo.png" alt="Facebook" width={24} height={24} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
        onClick={handleGithubSignIn}
      >
        <Image src="/images/github-icon.png" alt="GitHub" width={24} height={24} />
      </Button>
    </div>
  )
}
