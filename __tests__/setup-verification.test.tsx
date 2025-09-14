/**
 * Test to verify that the testing setup is working correctly
 */

import React from 'react'
import { render, screen } from '@testing-library/react'

// Simple component to test basic rendering
const TestComponent = () => {
  return (
    <div>
      <h1>Testing Setup</h1>
      <p>This component verifies that Jest and React Testing Library are working correctly.</p>
      <button data-testid="test-button">Click me</button>
    </div>
  )
}

describe('Testing Setup Verification', () => {
  it('should render components correctly', () => {
    render(<TestComponent />)
    
    expect(screen.getByText('Testing Setup')).toBeInTheDocument()
    expect(screen.getByText(/jest and react testing library/i)).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).toBeInTheDocument()
  })

  it('should handle basic assertions', () => {
    expect(1 + 1).toBe(2)
    expect('hello').toMatch(/ell/)
    expect([1, 2, 3]).toContain(2)
  })

  it('should work with async operations', async () => {
    const promise = Promise.resolve('success')
    const result = await promise
    expect(result).toBe('success')
  })

  it('should support mocking', () => {
    const mockFn = jest.fn()
    mockFn('test')
    
    expect(mockFn).toHaveBeenCalledWith('test')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should support DOM queries', () => {
    render(<TestComponent />)
    
    const heading = screen.getByRole('heading', { name: /testing setup/i })
    const button = screen.getByRole('button', { name: /click me/i })
    
    expect(heading).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  it('should support CSS selectors', () => {
    render(<TestComponent />)
    
    const buttonByTestId = screen.getByTestId('test-button')
    expect(buttonByTestId).toHaveTextContent('Click me')
  })
})

// Test Firebase mocks
describe('Firebase Mocks', () => {
  it('should have Firebase auth mocked', () => {
    const { auth } = require('@/lib/firebase')
    expect(auth).toBeDefined()
  })

  it('should have Firestore mocked', () => {
    const { db } = require('@/lib/firebase')
    expect(db).toBeDefined()
  })
})

// Test Next.js mocks
describe('Next.js Mocks', () => {
  it('should have router mocked', () => {
    const { useRouter } = require('next/navigation')
    const router = useRouter()
    
    expect(router.push).toBeDefined()
    expect(router.replace).toBeDefined()
    expect(typeof router.push).toBe('function')
  })

  it('should have image component mocked', () => {
    const Image = require('next/image').default
    
    render(<Image src="/test.jpg" alt="test" width={100} height={100} />)
    
    const img = screen.getByAltText('test')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.jpg')
  })
})
