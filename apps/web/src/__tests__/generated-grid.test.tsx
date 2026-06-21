import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GeneratedGrid } from '../app/generated/GeneratedGrid'
import type { StashImage } from '@chromatic/stash-client'

const FIXTURES: StashImage[] = [
  {
    id: 'seed-001',
    title: 'Studio Portrait A',
    path: 'https://picsum.photos/seed/seed-001/640/640',
    thumbnail: 'https://picsum.photos/seed/seed-001/320/320',
    tags: ['portrait', 'studio', 'stable'],
    rating: 5,
    createdAt: '2026-06-21',
    workflowId: 'portrait_headshot_v1',
    prompt: 'studio portrait a prompt',
    width: 640,
    height: 640,
  },
  {
    id: 'seed-005',
    title: 'Cinematic Landscape',
    path: 'https://picsum.photos/seed/seed-005/640/640',
    thumbnail: 'https://picsum.photos/seed/seed-005/320/320',
    tags: ['landscape', 'stable'],
    rating: 4,
    createdAt: '2026-06-15',
    workflowId: '01_txt2img_v1',
    prompt: 'cinematic landscape prompt',
    width: 640,
    height: 640,
  },
]

describe('GeneratedGrid', () => {
  it('renders a grid for each item', () => {
    render(<GeneratedGrid items={FIXTURES} />)
    expect(screen.getByTestId('generated-grid')).toBeInTheDocument()
    expect(screen.getByText('Studio Portrait A')).toBeInTheDocument()
    expect(screen.getByText('Cinematic Landscape')).toBeInTheDocument()
  })

  it('renders workflow ID for each item', () => {
    render(<GeneratedGrid items={FIXTURES} />)
    const ids = screen.getAllByTestId('workflow-id')
    expect(ids).toHaveLength(2)
    expect(ids[0]).toHaveTextContent('portrait_headshot_v1')
    expect(ids[1]).toHaveTextContent('01_txt2img_v1')
  })

  it('renders the rating badge', () => {
    render(<GeneratedGrid items={FIXTURES} />)
    expect(screen.getByLabelText('rating 5 of 5')).toBeInTheDocument()
    expect(screen.getByLabelText('rating 4 of 5')).toBeInTheDocument()
  })

  it('renders the copy-prompt button for each item with a prompt', () => {
    render(<GeneratedGrid items={FIXTURES} />)
    expect(screen.getByLabelText('Copy prompt for Studio Portrait A')).toBeInTheDocument()
    expect(screen.getByLabelText('Copy prompt for Cinematic Landscape')).toBeInTheDocument()
  })

  it('handles empty input without crashing', () => {
    render(<GeneratedGrid items={[]} />)
    expect(screen.getByTestId('generated-grid')).toBeInTheDocument()
  })
})
