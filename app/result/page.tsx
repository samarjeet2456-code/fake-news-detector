'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Share2,
  ArrowLeft,
  Shield,
  TrendingUp,
  AlertCircle,
  Target,
  FileText,
  Copy,
  Check,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

// Mock result data - in a real app this would come from an API
const mockResult = {
  verdict: 'real' as 'real' | 'fake',
  confidenceScore: 87,
  riskLevel: 'low' as 'low' | 'medium' | 'high',
  scores: {
    authenticity: 92,
    bias: 18,
    clickbait: 5,
  },
  explanation:
    'The article demonstrates characteristics of credible journalism. It cites specific sources, includes expert quotes with verifiable credentials, and presents multiple perspectives on the topic.',
  keywords: [
    { word: 'peer-reviewed', type: 'positive' as const },
    { word: 'Nature Energy', type: 'positive' as const },
    { word: 'Dr. Sarah Mitchell', type: 'positive' as const },
    { word: 'BREAKING', type: 'warning' as const },
    { word: 'revolutionize', type: 'warning' as const },
  ],
  analyzedContent:
    'Scientists at the International Research Institute have announced a groundbreaking discovery...',
}

export default function ResultPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState(mockResult)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    // Check if there's content to analyze
    const content = sessionStorage.getItem('resultContent')
    const contentType = (sessionStorage.getItem('resultType') as 'text' | 'url' | 'file') || 'text'
    if (!content) {
      router.push('/analyze')
      return
    }

    // Fetch real AI analysis from backend
    let isMounted = true;
    
    const analyzeData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Analysis failed');
        }
        
        const aiResult = await response.json();
        
        if (!isMounted) return;

        setResult({
          verdict: aiResult.verdict,
          confidenceScore: aiResult.confidenceScore,
          riskLevel: aiResult.riskLevel,
          scores: {
            authenticity: aiResult.authenticityScore,
            bias: aiResult.biasScore,
            clickbait: aiResult.clickbaitScore,
          },
          analyzedContent: content,
          explanation: aiResult.explanation,
          keywords: aiResult.keywords
        });
        
        setIsLoading(false);

        // Save the real analysis to Supabase
        const { error: sbError } = await supabase.from('analyses').insert({
          content_type: contentType,
          content: content,
          verdict: aiResult.verdict,
          confidence_score: aiResult.confidenceScore,
          risk_level: aiResult.riskLevel,
          authenticity_score: aiResult.authenticityScore,
          bias_score: aiResult.biasScore,
          clickbait_score: aiResult.clickbaitScore,
          explanation: aiResult.explanation,
          keywords: aiResult.keywords
        });

        if (sbError) {
          console.error("Failed to insert analysis into Supabase:", sbError);
          toast.warning("Analysis completed, but failed to save to history.");
        }
      } catch (err: any) {
        console.error("Error generating analysis:", err);
        if (isMounted) {
          setError(err.message || "Failed to analyze content");
          setIsLoading(false);
          toast.error(err.message || "Failed to analyze content");
        }
      }
    };

    analyzeData();

    return () => {
      isMounted = false;
    }
  }, [router])


  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleDownload = () => {
    toast.success('Report download started')
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-success'
      case 'medium':
        return 'text-warning'
      case 'high':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  const getScoreColor = (score: number, inverse = false) => {
    const effectiveScore = inverse ? 100 - score : score
    if (effectiveScore >= 70) return 'bg-success'
    if (effectiveScore >= 40) return 'bg-warning'
    return 'bg-destructive'
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <Skeleton className="h-48 w-full" />
          <div className="grid md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (error) {

    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-2">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold">Analysis Failed</h1>
          <p className="text-muted-foreground text-lg">
            {error.includes('limit') 
              ? "The AI is currently busy (Rate Limit). Please wait about 30 seconds and try again."
              : error}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              variant="default" 
              onClick={() => window.location.reload()}
              className="min-w-[140px]"
            >
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/analyze">
                Go Back
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isReal = result.verdict === 'real'


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Analysis Results
          </h1>
          <p className="text-muted-foreground text-lg">
            Here&apos;s what our AI found about your content
          </p>
        </div>

        {/* Main Verdict Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            className={cn(
              'border-2 overflow-hidden',
              isReal ? 'border-success/50' : 'border-destructive/50'
            )}
          >
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Verdict Badge */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.3,
                    }}
                    className={cn(
                      'flex h-24 w-24 items-center justify-center rounded-full',
                      isReal ? 'bg-success/10' : 'bg-destructive/10'
                    )}
                  >
                    {isReal ? (
                      <CheckCircle2 className="h-12 w-12 text-success" />
                    ) : (
                      <XCircle className="h-12 w-12 text-destructive" />
                    )}
                  </motion.div>
                  <Badge
                    className={cn(
                      'mt-4 text-base px-4 py-1',
                      isReal
                        ? 'bg-success/10 text-success hover:bg-success/20'
                        : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                    )}
                  >
                    {isReal ? 'Real News' : 'Fake News'}
                  </Badge>
                </div>

                {/* Confidence Score */}
                <div className="flex-1 w-full md:w-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Confidence Score
                    </span>
                    <span className="text-2xl font-bold">
                      {result.confidenceScore}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidenceScore}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={cn(
                        'h-full rounded-full',
                        isReal ? 'bg-success' : 'bg-destructive'
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <AlertTriangle
                      className={cn('h-4 w-4', getRiskColor(result.riskLevel))}
                    />
                    <span className="text-sm">
                      Risk Level:{' '}
                      <span
                        className={cn(
                          'font-medium capitalize',
                          getRiskColor(result.riskLevel)
                        )}
                      >
                        {result.riskLevel}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Authenticity Score',
              score: result.scores.authenticity,
              icon: Shield,
              description: 'Source credibility and fact accuracy',
              inverse: false,
            },
            {
              title: 'Bias Score',
              score: result.scores.bias,
              icon: TrendingUp,
              description: 'Political or emotional bias detected',
              inverse: true,
            },
            {
              title: 'Clickbait Score',
              score: result.scores.clickbait,
              icon: Target,
              description: 'Sensationalized or misleading headlines',
              inverse: true,
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-border/50 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Progress
                      value={item.score}
                      className={cn(
                        'h-2 flex-1 mr-4',
                        `[&>div]:${getScoreColor(item.score, item.inverse)}`
                      )}
                    />
                    <span className="text-lg font-bold">{item.score}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Analysis Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{result.explanation}</p>

              {/* Highlighted Keywords */}
              <div>
                <h4 className="text-sm font-medium mb-3">Key Indicators</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={cn(
                        keyword.type === 'positive'
                          ? 'border-success/50 text-success bg-success/5'
                          : 'border-warning/50 text-warning bg-warning/5'
                      )}
                    >
                      {keyword.word}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analyzed Content Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5" />
                Analyzed Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {result.analyzedContent}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Button variant="outline" asChild>
            <Link href="/analyze">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Analyze Another
            </Link>
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" onClick={handleShare}>
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Share2 className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Share Result'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
