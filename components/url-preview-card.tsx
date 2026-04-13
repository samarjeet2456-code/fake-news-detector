'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Globe } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface UrlPreviewCardProps {
  url: string
}

// Mock URL metadata - in a real app this would be fetched from an API
const getMockMetadata = (url: string) => {
  const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
  return {
    title: 'Sample News Article Title - Breaking News Coverage',
    description:
      'This is a preview of the article content. The full analysis will extract and verify all claims made in this piece.',
    image: null,
    domain,
  }
}

export function UrlPreviewCard({ url }: UrlPreviewCardProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [metadata, setMetadata] = React.useState<{
    title: string
    description: string
    image: string | null
    domain: string
  } | null>(null)

  React.useEffect(() => {
    setIsLoading(true)
    // Simulate loading delay
    const timer = setTimeout(() => {
      try {
        const data = getMockMetadata(url)
        setMetadata(data)
      } catch {
        setMetadata(null)
      }
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [url])

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metadata) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-border/50 hover:border-border transition-colors">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Placeholder Image */}
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted flex-shrink-0">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm line-clamp-2">
                  {metadata.title}
                </h4>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {metadata.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {metadata.domain}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
