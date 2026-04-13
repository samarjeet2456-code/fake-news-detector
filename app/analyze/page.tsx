'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2,
  FileText,
  Upload,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { UrlPreviewCard } from '@/components/url-preview-card'

const sampleNews = `BREAKING: Scientists at the International Research Institute have announced a groundbreaking discovery that could revolutionize renewable energy. The new technology, developed over five years of research, reportedly achieves 95% efficiency in solar energy conversion, far exceeding current standards.

Dr. Sarah Mitchell, lead researcher on the project, stated that the technology uses a novel combination of quantum dots and perovskite materials. The research has been peer-reviewed and published in Nature Energy.

However, some experts have raised concerns about the scalability of the technology and the timeline for commercial availability.`

export default function AnalyzePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'text' | 'url' | 'file'>('text')
  const [textContent, setTextContent] = React.useState('')
  const [urlContent, setUrlContent] = React.useState('')
  const [isDragging, setIsDragging] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [error, setError] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Load content from sessionStorage on mount
  React.useEffect(() => {
    const storedContent = sessionStorage.getItem('analyzeContent')
    const storedType = sessionStorage.getItem('analyzeInputType')
    
    if (storedContent) {
      if (storedType === 'url') {
        setUrlContent(storedContent)
        setActiveTab('url')
      } else {
        setTextContent(storedContent)
        setActiveTab('text')
      }
      // Clear the stored content
      sessionStorage.removeItem('analyzeContent')
      sessionStorage.removeItem('analyzeInputType')
    }
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'text/html']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a text file, PDF, or HTML file.')
      return
    }
    setSelectedFile(file)
    setError('')
  }

  const handleClear = () => {
    setTextContent('')
    setUrlContent('')
    setSelectedFile(null)
    setError('')
  }

  const handleLoadSample = () => {
    setTextContent(sampleNews)
    setActiveTab('text')
    setError('')
  }

  const getContent = () => {
    switch (activeTab) {
      case 'text':
        return textContent.trim()
      case 'url':
        return urlContent.trim()
      case 'file':
        return selectedFile ? selectedFile.name : ''
      default:
        return ''
    }
  }

  const isValid = () => {
    const content = getContent()
    if (!content) return false
    if (activeTab === 'url') {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      return urlPattern.test(content)
    }
    return true
  }

  const handleAnalyze = async () => {
    if (!isValid()) {
      setError(activeTab === 'url' ? 'Please enter a valid URL.' : 'Please enter content to analyze.')
      return
    }

    setIsAnalyzing(true)
    setError('')

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Store the content for the result page
    sessionStorage.setItem('resultContent', getContent())
    sessionStorage.setItem('resultType', activeTab)

    router.push('/result')
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Analyze Content
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit news content for AI-powered credibility analysis
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Input Content</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadSample}
                className="text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Load Sample
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'text' | 'url' | 'file')}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Text</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="gap-2">
                  <Link2 className="h-4 w-4" />
                  <span className="hidden sm:inline">URL</span>
                </TabsTrigger>
                <TabsTrigger value="file" className="gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">File</span>
                </TabsTrigger>
              </TabsList>

              {/* Text Input */}
              <TabsContent value="text" className="mt-4 space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Paste your news article text here..."
                    value={textContent}
                    onChange={(e) => {
                      setTextContent(e.target.value)
                      setError('')
                    }}
                    className="min-h-[250px] resize-none text-base"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {textContent.length} characters
                  </div>
                </div>
              </TabsContent>

              {/* URL Input */}
              <TabsContent value="url" className="mt-4 space-y-4">
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://example.com/news-article"
                    value={urlContent}
                    onChange={(e) => {
                      setUrlContent(e.target.value)
                      setError('')
                    }}
                    className="pl-10"
                  />
                </div>

                {/* URL Preview */}
                <AnimatePresence>
                  {urlContent && isValid() && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <UrlPreviewCard url={urlContent} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* File Upload */}
              <TabsContent value="file" className="mt-4 space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'relative flex flex-col items-center justify-center min-h-[200px] rounded-lg border-2 border-dashed cursor-pointer transition-colors',
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.html"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(e.target.files[0])
                      }
                    }}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-7 w-7 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFile(null)
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
                        <Upload className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          Drag and drop your file here
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse (TXT, PDF, HTML)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button
                variant="ghost"
                onClick={handleClear}
                disabled={!getContent()}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Input
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={!isValid() || isAnalyzing}
                className="min-w-[140px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Your content is processed securely and not stored after analysis.
        </p>
      </motion.div>
    </div>
  )
}
