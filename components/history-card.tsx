'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, Link2, FileText, ExternalLink } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HistoryCardProps {
  id: string
  content: string
  verdict: 'real' | 'fake'
  confidenceScore: number
  date: Date
  type: 'text' | 'url'
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export function HistoryCard({
  id,
  content,
  verdict,
  confidenceScore,
  date,
  type,
}: HistoryCardProps) {
  const isReal = verdict === 'real'

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className="border-border/50 hover:border-border transition-colors cursor-pointer group">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {/* Verdict Icon */}
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0',
                isReal ? 'bg-success/10' : 'bg-destructive/10'
              )}
            >
              {isReal ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn(
                      isReal
                        ? 'border-success/50 text-success bg-success/5'
                        : 'border-destructive/50 text-destructive bg-destructive/5'
                    )}
                  >
                    {isReal ? 'Real' : 'Fake'}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {confidenceScore}% confidence
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground gap-1">
                    {type === 'url' ? (
                      <Link2 className="h-3 w-3" />
                    ) : (
                      <FileText className="h-3 w-3" />
                    )}
                    {type === 'url' ? 'URL' : 'Text'}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRelativeTime(date)}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View Details
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
