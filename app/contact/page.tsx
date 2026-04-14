import { Mail, MessageSquare, Github } from 'lucide-react'

export const metadata = {
  title: 'Contact – VerifyAI',
  description: 'Get in touch with the VerifyAI team for questions, feedback, or support.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-6">
            <MessageSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            Have a question, found a bug, or want to give feedback? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact cards */}
        <div className="space-y-4 mb-12">
          <a
            href="mailto:support@verifyai.app"
            className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-6 hover:border-primary/40 transition-colors group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Email Support</p>
              <p className="text-sm text-muted-foreground">support@verifyai.app</p>
            </div>
          </a>

          <a
            href="https://github.com/samarjeet2456-code/fake-news-detector"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-6 hover:border-primary/40 transition-colors group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Github className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">GitHub</p>
              <p className="text-sm text-muted-foreground">Open an issue or contribute</p>
            </div>
          </a>
        </div>

        {/* Note */}
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            We typically respond within 1–2 business days. For urgent issues, please use GitHub Issues.
          </p>
        </div>
      </div>
    </main>
  )
}
