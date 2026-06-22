import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import VideoPage from './page'

vi.mock('../../components/ThemeToggle', () => ({
  ThemeToggle: () => <button type="button" aria-label="theme-toggle" />,
}))

describe('VideoPage', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_STASH_URL
  })

  it('renders Video Lane Surface heading and demo data badge', async () => {
    const jsx = await VideoPage()
    render(jsx as React.ReactElement)
    expect(
      screen.getByRole('heading', { level: 1, name: /Video Lane Surface/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Demo data')).toBeInTheDocument()
    expect(
      screen.getAllByText(/stable-video-diffusion-img2vid-xt/).length,
    ).toBeGreaterThan(0)
  })

  it('renders one card per video from the mock', async () => {
    const jsx = await VideoPage()
    render(jsx as React.ReactElement)
    const list = screen.getByRole('list', { name: /generated videos/i })
    const items = list.querySelectorAll(':scope > li')
    expect(items).toHaveLength(12)
  })
})
