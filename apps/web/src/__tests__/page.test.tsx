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

  it('renders both CTA buttons', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: /Open Dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Read the PDR/i })).toBeInTheDocument()
  })

  it('renders the navigation links', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Assets/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Prompts/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Agents/i })).toBeInTheDocument()
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
    expect(screen.getByText(/Chromatic Design Studios v0\.1\.0/)).toBeInTheDocument()
  })

  it('CTA buttons are button elements (not anchors)', () => {
    render(<Home />)
    const dashboardBtn = screen.getByRole('button', { name: /Open Dashboard/i })
    const pdrBtn = screen.getByRole('button', { name: /Read the PDR/i })
    expect(dashboardBtn.tagName).toBe('BUTTON')
    expect(pdrBtn.tagName).toBe('BUTTON')
  })
})
