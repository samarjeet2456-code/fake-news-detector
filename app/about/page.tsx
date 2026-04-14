import { Shield, Zap, Brain, Globe } from 'lucide-react'

export const metadata = {
  title: 'About – VerifyAI',
  description: 'Learn about VerifyAI, our mission to combat misinformation, and how our AI-powered platform works.',
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'We use Google Gemini, one of the most advanced large language models, to analyze news content for credibility, bias, and clickbait patterns.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get a detailed credibility report in seconds. Our platform processes articles and headlines with real-time scoring.',
  },
  {
    icon: Globe,
    title: 'Built for Everyone',
    description: 'Whether you\'re a journalist, researcher, or everyday reader, VerifyAI helps you make informed decisions about the content you consume.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'We don\'t store your submitted content beyond what\'s needed for analysis. Your data stays yours.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-6">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">About VerifyAI</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            VerifyAI is an AI-powered fake news detection platform built to help people navigate today&apos;s complex media landscape with confidence.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border border-border/60 bg-card p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Misinformation spreads faster than ever. We built VerifyAI to give everyone access to the same analytical tools that fact-checkers and journalists use — powered by cutting-edge AI. Our goal is to make credibility verification fast, accessible, and reliable.
          </p>
        </div>

        {/* Features Grid */}
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Built with */}
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Built with</h2>
          <p className="text-muted-foreground text-sm">
            Next.js · Google Gemini API · Supabase · Vercel
          </p>
        </div>
      </div>
    </main>
  )
}
