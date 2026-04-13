'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Inbox, Search, Plus, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  searchQuery?: string
  filter?: string
  onClearFilters?: () => void
}

export function EmptyState({
  searchQuery,
  filter,
  onClearFilters,
}: EmptyStateProps) {
  const hasFilters = searchQuery || (filter && filter !== 'all')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        {hasFilters ? (
          <Search className="h-10 w-10 text-muted-foreground" />
        ) : (
          <Inbox className="h-10 w-10 text-muted-foreground" />
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {hasFilters ? 'No results found' : 'No analysis history yet'}
      </h3>

      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {hasFilters
          ? 'Try adjusting your search or filters to find what you\'re looking for.'
          : 'Start analyzing news articles to build your verification history.'}
      </p>

      <div className="flex items-center gap-3">
        {hasFilters ? (
          <Button variant="outline" onClick={onClearFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        ) : (
          <Button asChild>
            <Link href="/analyze">
              <Plus className="h-4 w-4 mr-2" />
              Start Analyzing
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  )
}
