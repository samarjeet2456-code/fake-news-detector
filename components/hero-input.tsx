'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Link2, FileText, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const sampleNews = `BREAKING: Scientists at the International Research Institute have announced a groundbreaking discovery that could revolutionize renewable energy. The new technology, developed over five years of research, reportedly achieves 95% efficiency in solar energy conversion, far exceeding current standards.

Dr. Sarah Mitchell, lead researcher on the project, stated that the technology uses a novel combination of quantum dots and perovskite materials. The research has been peer-reviewed and published in Nature Energy.

However, some experts have raised concerns about the scalability of the technology and the timeline for commercial availability.`

export function HeroInput() {
  const router = useRouter()
  const [content, setContent] = React.useState('')
  const [inputType, setInputType] = React.useState<'text' | 'url'>('text')

  const handleLoadSample = () => {
    setContent(sampleNews)
    setInputType('text')
  }

  const handleAnalyze = () => {
    if (content.trim()) {
      // Store the content in sessionStorage for the analyze page
      sessionStorage.setItem('analyzeContent', content)
      sessionStorage.setItem('analyzeInputType', inputType)
      router.push('/analyze')
    }
  }

  const detectInputType = (value: string) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    if (urlPattern.test(value.trim())) {
      setInputType('url')
    } else {
      setInputType('text')
    }
    setContent(value)
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
              inputType === 'text'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <FileText className="h-3 w-3" />
            Text
          </div>
          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
              inputType === 'url'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Link2 className="h-3 w-3" />
            URL
          </div>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadSample}
            className="text-xs h-7 px-2"
          >
            <Sparkles className="h-3 w-3 mr-1.5" />
            Load Sample
          </Button>
        </div>

        <Textarea
          placeholder="Paste your news article here or enter a URL to analyze..."
          value={content}
          onChange={(e) => detectInputType(e.target.value)}
          className="min-h-[140px] resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent text-base"
        />

        <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-muted/30">
          <span className="text-xs text-muted-foreground">
            {content.length} characters
          </span>
          <Button
            onClick={handleAnalyze}
            disabled={!content.trim()}
            className="group"
          >
            Analyze
            <motion.span
              initial={false}
              animate={{ x: content.trim() ? 0 : -5, opacity: content.trim() ? 1 : 0 }}
              className="ml-1"
            >
              →
            </motion.span>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
