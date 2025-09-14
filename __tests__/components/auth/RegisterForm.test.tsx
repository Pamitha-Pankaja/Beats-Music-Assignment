import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '@/components/auth/register-form'
import { emailSignUp } from '@/lib/auth'
import { toast } from '@/hooks/use-toast'

// Mock the auth library
jest.mock('@/lib/auth', () => ({
  emailSignUp: jest.fn(),
}))

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}))

describe('RegisterForm Component', () => {
  const mockEmailSignUp = emailSignUp as jest.MockedFunction<typeof emailSignUp>
  const mockToast = toast as jest.MockedFunction<typeof toast>
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form elements correctly', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /agree our policy/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create new account/i })).toBeInTheDocument()
  })

  it('handles form input changes correctly', async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    const usernameInput = screen.getByPlaceholderText(/username/i)
    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/^password$/i)
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i)
    
    await user.type(usernameInput, 'testuser')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    
    expect(usernameInput).toHaveValue('testuser')
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('password123')
  })

  it('handles successful registration', async () => {
    const user = userEvent.setup()
    mockEmailSignUp.mockResolvedValue({
      user: { uid: 'new-uid', email: 'test@example.com' }
    } as any)
    
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    // Fill form
    await user.type(screen.getByPlaceholderText(/username/i), 'testuser')
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/^password$/i), 'password123')
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123')
    await user.click(screen.getByRole('checkbox', { name: /agree our policy/i }))
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create new account/i }))
    
    await waitFor(() => {
      expect(mockEmailSignUp).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser')
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Account created successfully!',
      })
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('validates password confirmation', async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    // Fill form with mismatched passwords
    await user.type(screen.getByPlaceholderText(/username/i), 'testuser')
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/^password$/i), 'password123')
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'differentpassword')
    await user.click(screen.getByRole('checkbox', { name: /agree our policy/i }))
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create new account/i }))
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      })
      expect(mockEmailSignUp).not.toHaveBeenCalled()
    })
  })

  it('requires policy agreement', async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    // Fill form without agreeing to policy
    await user.type(screen.getByPlaceholderText(/username/i), 'testuser')
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/^password$/i), 'password123')
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123')
    // Don't check the policy checkbox
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create new account/i }))
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Please agree to our policy to continue',
        variant: 'destructive',
      })
      expect(mockEmailSignUp).not.toHaveBeenCalled()
    })
  })

  it('validates password length', async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    // Fill form with short password
    await user.type(screen.getByPlaceholderText(/username/i), 'testuser')
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/^password$/i), '123')
    await user.type(screen.getByPlaceholderText(/confirm password/i), '123')
    await user.click(screen.getByRole('checkbox', { name: /agree our policy/i }))
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create new account/i }))
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      })
      expect(mockEmailSignUp).not.toHaveBeenCalled()
    })
  })

  it('handles registration failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Email already in use'
    mockEmailSignUp.mockRejectedValue(new Error(errorMessage))
    
    render(<RegisterForm onSuccess={mockOnSuccess} />)
    
    // Fill form correctly
    await user.type(screen.getByPlaceholderText(/username/i), 'testuser')
    await user.type(screen.getByPlaceholderText(/email/i), 'existing@example.com')
    await user.type(screen.getByPlaceholderText(/^password$/i), 'password123')
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123')
    await user.click(screen.getByRole('checkbox', { name: /agree our policy/i }))
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create new account/i }))
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    })
  })
})
