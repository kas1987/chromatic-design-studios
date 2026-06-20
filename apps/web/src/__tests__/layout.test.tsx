import { vi, describe, it, expect, afterEach } from 'vitest'

// Must be mocked before layout is imported — vi.mock is hoisted automatically.
// Layout uses Inter (UI/heading), IBM Plex Sans (body), IBM Plex Mono (code).
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter', className: 'mock-inter' }),
  IBM_Plex_Sans: () => ({ variable: '--font-plex-sans', className: 'mock-plex-sans' }),
  IBM_Plex_Mono: () => ({ variable: '--font-plex-mono', className: 'mock-plex-mono' }),
}))

import { render } from '@testing-library/react'
import { metadata } from '../app/layout'
import RootLayout from '../app/layout'

describe('layout metadata', () => {
  it('has the correct page title', () => {
    // title is a template object: { default, template }
    expect(metadata.title).toMatchObject({ default: 'Chromatic Design Studios' })
  })

  it('has the correct page description', () => {
    expect(metadata.description).toContain(
      'Local-first AI design and operations control center'
    )
  })
})

describe('RootLayout component', () => {
  afterEach(() => {
    document.body.className = ''
    document.documentElement.className = ''
    document.documentElement.removeAttribute('lang')
  })

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
