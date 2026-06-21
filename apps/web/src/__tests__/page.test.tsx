import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home page (v0.4.0 Platform Surface)', () => {
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
    expect(screen.getByText('A Front-end')).toBeInTheDocument()
    expect(screen.getByText('Resource Platform')).toBeInTheDocument()
  })

  it('renders the hero description', () => {
    render(<Home />)
    expect(
      screen.getByText(/Token-driven, agent-readable, locally runnable/i),
    ).toBeInTheDocument()
  })

  it('renders both hero CTAs', () => {
    render(<Home />)
    expect(
      screen.getByRole('link', { name: /Browse components/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Explore tokens/i }),
    ).toBeInTheDocument()
  })

  it('renders the global primary nav', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: 'Components' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tokens' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Examples' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Playground' })).toBeInTheDocument()
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
    expect(
      screen.getByText(/Chromatic Design Studios v0\.4\.0/),
    ).toBeInTheDocument()
  })

  it('hero CTAs render as anchors (Button with href)', () => {
    render(<Home />)
    const browseCta = screen.getByRole('link', { name: /Browse components/i })
    const exploreCta = screen.getByRole('link', { name: /Explore tokens/i })
    expect(browseCta.tagName).toBe('A')
    expect(exploreCta.tagName).toBe('A')
  })

  it('renders the surface grid with all four route cards', () => {
    render(<Home />)
    // Each surface card surfaces the route as a Link with the path text.
    expect(screen.getByText('/components')).toBeInTheDocument()
    expect(screen.getByText('/tokens')).toBeInTheDocument()
    expect(screen.getByText('/examples')).toBeInTheDocument()
    expect(screen.getByText('/playground')).toBeInTheDocument()
  })
})
