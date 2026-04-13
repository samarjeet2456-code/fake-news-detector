'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Calendar,
  FileText,
  ExternalLink,
  Inbox,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { HistoryCard } from '@/components/history-card'
import { EmptyState } from '@/components/empty-state'
import { supabase } from '@/lib/supabase'

type FilterType = 'all' | 'real' | 'fake'

type HistoryItem = {
  id: string
  content: string
  verdict: 'real' | 'fake'
  confidenceScore: number
  date: Date
  type: 'text' | 'url' | 'file'
}

export default function DashboardPage() {
  const [history, setHistory] = React.useState<HistoryItem[]>([])
  const [filter, setFilter] = React.useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showEmptyDemo, setShowEmptyDemo] = React.useState(false)

  React.useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching history:', error)
      } else if (data) {
        const formattedHistory = data.map(item => ({
          id: item.id,
          content: item.content,
          verdict: item.verdict as 'real' | 'fake',
          confidenceScore: item.confidence_score,
          date: new Date(item.created_at),
          type: item.content_type as 'text' | 'url' | 'file'
        }))
        setHistory(formattedHistory)
      }
    }
    
    fetchHistory()
  }, [])

  const filteredHistory = React.useMemo(() => {
    if (showEmptyDemo) return []

    return history.filter((item) => {
      // Filter by verdict
      if (filter !== 'all' && item.verdict !== filter) return false

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return item.content.toLowerCase().includes(query)
      }

      return true
    })
  }, [filter, searchQuery, showEmptyDemo, history])

  const stats = React.useMemo(() => {
    const total = history.length
    const real = history.filter((item: HistoryItem) => item.verdict === 'real').length
    const fake = history.filter((item: HistoryItem) => item.verdict === 'fake').length
    return { total, real, fake }
  }, [history])

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              View your analysis history and track your verifications
            </p>
          </div>
          <Button asChild>
            <Link href="/analyze">
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Analyses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.real}</p>
                  <p className="text-sm text-muted-foreground">Real News</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.fake}</p>
                  <p className="text-sm text-muted-foreground">Fake News</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Analysis History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Tabs */}
              <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as FilterType)}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="real" className="gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Real
                  </TabsTrigger>
                  <TabsTrigger value="fake" className="gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    Fake
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Demo Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmptyDemo(!showEmptyDemo)}
                className="hidden md:flex"
              >
                {showEmptyDemo ? 'Show History' : 'Show Empty State'}
              </Button>
            </div>

            {/* History List */}
            <AnimatePresence mode="wait">
              {filteredHistory.length > 0 ? (
                <motion.div
                  key="history"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {filteredHistory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <HistoryCard {...item} type={item.type as 'text' | 'url'} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState
                    searchQuery={searchQuery}
                    filter={filter}
                    onClearFilters={() => {
                      setSearchQuery('')
                      setFilter('all')
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
