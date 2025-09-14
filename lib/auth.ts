"use client"

import { auth, googleProvider, githubProvider, facebookProvider } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth"

/** Email & password sign up (optionally set display name) */
export async function emailSignUp(email: string, password: string, displayName?: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) await updateProfile(cred.user, { displayName })
  return cred.user
}

/** Email & password sign in */
export async function emailSignIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

/** Google OAuth sign-in */
export function googleSignIn() {
  return signInWithPopup(auth, googleProvider)
}

/** GitHub OAuth sign-in */
export function githubSignIn() {
  return signInWithPopup(auth, githubProvider)
}

/** Facebook OAuth sign-in */
export function facebookSignIn() {
  return signInWithPopup(auth, facebookProvider)
}
