import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VideoGrid } from '../app/video/VideoGrid'
import type { StashVideo } from '@chromatic/stash-client'

const FIXTURES: StashVideo[] = [
  {
    id: 'vid-001',
    title: 'i2v Run #001',
    path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://picsum.photos/seed/vid-001/320/180',
    tags: ['i2v', 'portrait', 'stable'],
    rating: 5,
    createdAt: '2026-06-20',
    workflowId: 'svd_img2vid_v1',
    prompt: 'i2v run #001 prompt',
    model: 'stabilityai/stable-video-diffusion-img2vid-xt',
    durationSec: 6,
    fps: 6,
    frames: 36,
    sourceImageId: 'seed-001',
  },
  {
    id: 'vid-002',
    title: 'i2v Run #002',
    path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://picsum.photos/seed/vid-002/320/180',
    tags: ['i2v', 'landscape', 'beta'],
    rating: 4,
    createdAt: '2026-06-15',
    workflowId: 'svd_img2vid_v1',
    prompt: 'i2v run #002 prompt',
    model: 'stabilityai/stable-video-diffusion-img2vid-xt',
    durationSec: 5,
    fps: 6,
    frames: 30,
    sourceImageId: 'seed-005',
  },
]

describe('VideoGrid', () => {
  it('renders one card per video', () => {
    render(<VideoGrid items={FIXTURES} />)
    const list = screen.getByRole('list', { name: /generated videos/i })
    const items = list.querySelectorAll(':scope > li')
    expect(items).toHaveLength(2)
  })

  it('renders a <video> element per item with src + poster', () => {
    render(<VideoGrid items={FIXTURES} />)
    const videos = screen.getAllByTestId('video-clip') as HTMLVideoElement[]
    expect(videos).toHaveLength(2)
    expect(videos[0].src).toContain('BigBuckBunny.mp4')
    expect(videos[0].poster).toContain('vid-001/320/180')
    expect(videos[0].preload).toBe('metadata')
    expect(videos[0].controls).toBe(true)
  })

  it('shows the SVD model id and source image id', () => {
    render(<VideoGrid items={FIXTURES} />)
    expect(screen.getAllByText(/stable-video-diffusion/).length).toBeGreaterThan(0)
    expect(screen.getByText(/seed-001/)).toBeInTheDocument()
    expect(screen.getByText(/seed-005/)).toBeInTheDocument()
  })

  it('shows the workflow + fps + duration badges', () => {
    render(<VideoGrid items={FIXTURES} />)
    expect(screen.getAllByText('svd_img2vid_v1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('6 fps').length).toBeGreaterThan(0)
    expect(screen.getByText('6s')).toBeInTheDocument()
    expect(screen.getByText('5s')).toBeInTheDocument()
  })

  it('shows copy prompt buttons', () => {
    render(<VideoGrid items={FIXTURES} />)
    const buttons = screen.getAllByRole('button', { name: /copy prompt/i })
    expect(buttons).toHaveLength(2)
  })

  it('shows rating badges', () => {
    render(<VideoGrid items={FIXTURES} />)
    expect(screen.getByText('★ 5/5')).toBeInTheDocument()
    expect(screen.getByText('★ 4/5')).toBeInTheDocument()
  })
})
