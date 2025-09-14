import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/login-form'
import { emailSignIn } from '@/lib/auth'
import { toast } from '@/hooks/use-toast'

// Mock the auth library
jest.mock('@/lib/auth', () => ({
  emailSignIn: jest.fn(),
}))

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('LoginForm Component', () => {
  const mockEmailSignIn = emailSignIn as jest.MockedFunction<typeof emailSignIn>
  const mockToast = toast as jest.MockedFunction<typeof toast>

  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  it('renders all form elements correctly', () => {
    render(<LoginForm />)
    
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByText(/glad you're back/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('handles form input changes correctly', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const usernameInput = screen.getByPlaceholderText(/username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    
    await user.type(usernameInput, 'testuser@example.com')
    await user.type(passwordInput, 'testpassword123')
    
    expect(usernameInput).toHaveValue('testuser@example.com')
    expect(passwordInput).toHaveValue('testpassword123')
  })

  it('handles successful login correctly', async () => {
    const user = userEvent.setup()
    mockEmailSignIn.mockResolvedValue({
      user: { uid: 'test-uid', email: 'test@example.com' }
    } as any)
    
    render(<LoginForm />)
    
    const usernameInput = screen.getByPlaceholderText(/username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(usernameInput, 'testuser@example.com')
    await user.type(passwordInput, 'testpassword123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockEmailSignIn).toHaveBeenCalledWith('testuser@example.com', 'testpassword123')
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Welcome back!',
        description: 'Successfully logged in to your account',
      })
      expect(mockPush).toHaveBeenCalledWith('/home')
    })
  })

  it('handles login failure correctly', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'
    mockEmailSignIn.mockRejectedValue(new Error(errorMessage))
    
    render(<LoginForm />)
    
    const usernameInput = screen.getByPlaceholderText(/username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(usernameInput, 'testuser@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      })
    })
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    
    mockEmailSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<LoginForm />)
    
    const usernameInput = screen.getByPlaceholderText(/username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.type(usernameInput, 'testuser@example.com')
    await user.type(passwordInput, 'testpassword123')
    await user.click(submitButton)
    
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled()
  })

  it('validates required fields', () => {
    render(<LoginForm />)
    
    const usernameInput = screen.getByPlaceholderText(/username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    
    expect(usernameInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })
})
