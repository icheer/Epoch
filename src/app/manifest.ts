import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Epoch',
    short_name: 'Epoch',
    description: 'Visual interface for LLMs — turn AI conversations into interactive experiences.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
  }
}
