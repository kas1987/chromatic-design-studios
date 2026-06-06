import { vi, describe, it, expect } from 'vitest'

// Must be mocked before layout is imported — vi.mock is hoisted automatically
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans', className: 'mock-geist' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono', className: 'mock-geist-mono' }),
}))

import { render } from '@testing-library/react'
import { metadata } from '../app/layout'
import RootLayout from '../app/layout'

describe('layout metadata', () => {
  it('has the correct page title', () => {
    expect(metadata.title).toBe('Chromatic Design Studios')
  })

  it('has the correct page description', () => {
    expect(metadata.description).toBe('Local-first AI design and operations control center')
  })
})

describe('RootLayout component', () => {
  it('renders children', () => {
    const { getByText } = render(
      <RootLayout>
        <div>test child content</div>
      </RootLayout>
    )
    expect(getByText('test child content')).toBeTruthy()
  })

  it('applies antialiased and min-h-screen classes to body', () => {
    render(
      <RootLayout>
        <span />
      </RootLayout>
    )
    // jsdom hoists <body> to document.body
    expect(document.body.className).toMatch(/antialiased/)
    expect(document.body.className).toMatch(/min-h-screen/)
  })

  it('sets dark class on html element', () => {
    render(
      <RootLayout>
        <span />
      </RootLayout>
    )
    // jsdom hoists <html> to document.documentElement
    expect(document.documentElement.className).toContain('dark')
  })

  it('sets lang="en" on html element', () => {
    render(
      <RootLayout>
        <span />
      </RootLayout>
    )
    expect(document.documentElement.lang).toBe('en')
  })
})
