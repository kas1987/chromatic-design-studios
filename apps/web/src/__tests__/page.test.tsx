import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home page', () => {
  it('renders without crashing', () => {
    const { container } = render(<Home />)
    expect(container).toBeTruthy()
  })

  it('renders the brand name in the header', () => {
    render(<Home />)
    expect(screen.getByText('Chromatic Design Studios')).toBeInTheDocument()
  })

  it('renders the hero heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('AI Design')).toBeInTheDocument()
    expect(screen.getByText('Control Center')).toBeInTheDocument()
  })

  it('renders the hero description', () => {
    render(<Home />)
    expect(screen.getByText(/Orchestrate models, prompts, agents/i)).toBeInTheDocument()
  })

  it('renders both hero CTAs', () => {
    render(<Home />)
    // Hero CTAs render via the Button component as links (href set).
    expect(screen.getByRole('link', { name: /Open Dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Read the PDR/i })).toBeInTheDocument()
  })

  it('renders the navigation links', () => {
    render(<Home />)
    // Exact names avoid colliding with the "Open Dashboard" hero CTA.
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Assets' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Prompts' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Studio' })).toBeInTheDocument()
  })

  it('renders the nav inside a <header> element', () => {
    render(<Home />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    const nav = screen.getByRole('navigation')
    expect(header).toContainElement(nav)
  })

  it('renders a <main> landmark', () => {
    render(<Home />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders a <footer> with correct version text', () => {
    render(<Home />)
    // Correct brand name (not "Chromactic")
    expect(screen.getByText(/Chromatic Design Studios v0\.4\.0/)).toBeInTheDocument()
  })

  it('hero CTAs render as anchors (Button with href)', () => {
    render(<Home />)
    // The Hero Button component renders an <a> when an href is supplied.
    const dashboardCta = screen.getByRole('link', { name: /Open Dashboard/i })
    const pdrCta = screen.getByRole('link', { name: /Read the PDR/i })
    expect(dashboardCta.tagName).toBe('A')
    expect(pdrCta.tagName).toBe('A')
  })
})
