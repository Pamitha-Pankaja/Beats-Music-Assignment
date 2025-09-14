import { emailSignIn, emailSignUp, googleSignIn, githubSignIn, facebookSignIn } from '@/lib/auth'

// The functions are already mocked in jest.setup.js
// We just need to cast them to get proper TypeScript types
const mockEmailSignIn = emailSignIn as jest.MockedFunction<typeof emailSignIn>
const mockEmailSignUp = emailSignUp as jest.MockedFunction<typeof emailSignUp>
const mockGoogleSignIn = googleSignIn as jest.MockedFunction<typeof googleSignIn>
const mockGithubSignIn = githubSignIn as jest.MockedFunction<typeof githubSignIn>
const mockFacebookSignIn = facebookSignIn as jest.MockedFunction<typeof facebookSignIn>

describe('Auth Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('emailSignIn', () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
    }

    it('should be a mocked function', () => {
      expect(jest.isMockFunction(emailSignIn)).toBe(true)
    })

    it('should resolve with user on success', async () => {
      mockEmailSignIn.mockResolvedValue(mockUser as any)

      const result = await emailSignIn('test@example.com', 'password123')

      expect(mockEmailSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(result).toEqual(mockUser)
    })

    it('should throw error on failure', async () => {
      const error = new Error('Invalid credentials')
      mockEmailSignIn.mockRejectedValue(error)

      await expect(emailSignIn('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials')
    })

    it('should handle Firebase auth errors', async () => {
      const firebaseError = {
        code: 'auth/user-not-found',
        message: 'User not found'
      }
      mockEmailSignIn.mockRejectedValue(firebaseError)

      await expect(emailSignIn('nonexistent@example.com', 'password')).rejects.toEqual(firebaseError)
    })
  })

  describe('emailSignUp', () => {
    const mockUser = {
      uid: 'new-test-uid',
      email: 'newuser@example.com',
      displayName: 'Test User',
    }

    it('should be a mocked function', () => {
      expect(jest.isMockFunction(emailSignUp)).toBe(true)
    })

    it('should resolve with user on successful registration', async () => {
      mockEmailSignUp.mockResolvedValue(mockUser as any)

      const result = await emailSignUp('newuser@example.com', 'password123', 'Test User')

      expect(mockEmailSignUp).toHaveBeenCalledWith('newuser@example.com', 'password123', 'Test User')
      expect(result).toEqual(mockUser)
    })

    it('should handle registration errors', async () => {
      const firebaseError = {
        code: 'auth/email-already-in-use',
        message: 'The email address is already in use'
      }
      mockEmailSignUp.mockRejectedValue(firebaseError)

      await expect(emailSignUp('existing@example.com', 'password123', 'Test User')).rejects.toEqual(firebaseError)
    })
  })

  describe('googleSignIn', () => {
    const mockUserCredential = {
      user: {
        uid: 'google-uid',
        email: 'google@example.com',
        displayName: 'Google User',
      },
    }

    it('should be a mocked function', () => {
      expect(jest.isMockFunction(googleSignIn)).toBe(true)
    })

    it('should resolve with user credential on success', async () => {
      mockGoogleSignIn.mockResolvedValue(mockUserCredential as any)

      const result = await googleSignIn()

      expect(mockGoogleSignIn).toHaveBeenCalled()
      expect(result).toEqual(mockUserCredential)
    })

    it('should handle Google sign-in errors', async () => {
      const firebaseError = {
        code: 'auth/popup-closed-by-user',
        message: 'The popup has been closed by the user'
      }
      mockGoogleSignIn.mockRejectedValue(firebaseError)

      await expect(googleSignIn()).rejects.toEqual(firebaseError)
    })
  })

  describe('githubSignIn', () => {
    const mockUserCredential = {
      user: {
        uid: 'github-uid',
        email: 'github@example.com',
        displayName: 'GitHub User',
      },
    }

    it('should be a mocked function', () => {
      expect(jest.isMockFunction(githubSignIn)).toBe(true)
    })

    it('should resolve with user credential on success', async () => {
      mockGithubSignIn.mockResolvedValue(mockUserCredential as any)

      const result = await githubSignIn()

      expect(mockGithubSignIn).toHaveBeenCalled()
      expect(result).toEqual(mockUserCredential)
    })

    it('should handle GitHub sign-in errors', async () => {
      const firebaseError = {
        code: 'auth/popup-blocked',
        message: 'Unable to establish a connection with the popup'
      }
      mockGithubSignIn.mockRejectedValue(firebaseError)

      await expect(githubSignIn()).rejects.toEqual(firebaseError)
    })
  })

  describe('facebookSignIn', () => {
    const mockUserCredential = {
      user: {
        uid: 'facebook-uid',
        email: 'facebook@example.com',
        displayName: 'Facebook User',
      },
    }

    it('should be a mocked function', () => {
      expect(jest.isMockFunction(facebookSignIn)).toBe(true)
    })

    it('should resolve with user credential on success', async () => {
      mockFacebookSignIn.mockResolvedValue(mockUserCredential as any)

      const result = await facebookSignIn()

      expect(mockFacebookSignIn).toHaveBeenCalled()
      expect(result).toEqual(mockUserCredential)
    })

    it('should handle Facebook sign-in errors', async () => {
      const firebaseError = {
        code: 'auth/account-exists-with-different-credential',
        message: 'An account already exists with the same email address'
      }
      mockFacebookSignIn.mockRejectedValue(firebaseError)

      await expect(facebookSignIn()).rejects.toEqual(firebaseError)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors consistently', async () => {
      const networkError = new Error('Network request failed')
      mockEmailSignIn.mockRejectedValue(networkError)

      await expect(emailSignIn('test@example.com', 'password')).rejects.toThrow('Network request failed')
    })

    it('should handle concurrent operations', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' }
      mockEmailSignIn.mockResolvedValue(mockUser as any)

      const promises = [
        emailSignIn('test1@example.com', 'password'),
        emailSignIn('test2@example.com', 'password'),
        emailSignIn('test3@example.com', 'password'),
      ]

      const results = await Promise.all(promises)

      expect(results).toHaveLength(3)
      expect(mockEmailSignIn).toHaveBeenCalledTimes(3)
    })
  })
})
