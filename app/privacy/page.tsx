import { Lock } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy – VerifyAI',
  description: 'Read the VerifyAI privacy policy to understand how we handle your data.',
}

const sections = [
  {
    title: '1. Information We Collect',
    body: 'When you use VerifyAI, we may collect the content you submit for analysis (articles, headlines, or URLs) and basic usage metadata such as timestamps and result scores. We do not collect personally identifiable information unless you create an account.',
  },
  {
    title: '2. How We Use Your Data',
    body: 'Submitted content is used solely to generate an AI credibility analysis via the Google Gemini API. Analysis results may be stored in our database (Supabase) to power the public dashboard and trend features. We do not sell your data to third parties.',
  },
  {
    title: '3. Third-Party Services',
    body: 'VerifyAI uses the following third-party services: Google Gemini API (AI analysis), Supabase (database), and Vercel (hosting). Each of these services has their own privacy policy that governs their data handling.',
  },
  {
    title: '4. Cookies',
    body: 'We use only essential cookies required for authentication and session management. We do not use tracking or advertising cookies.',
  },
  {
    title: '5. Data Retention',
    body: 'Analysis results may be stored indefinitely to support dashboard features. If you wish to have your data removed, please contact us and we will process your request within 30 days.',
  },
  {
    title: '6. Security',
    body: 'We take reasonable measures to protect data in transit and at rest. However, no system is 100% secure. Please do not submit sensitive personal information through the analysis tool.',
  },
  {
    title: '7. Changes to This Policy',
    body: 'We may update this policy from time to time. Changes will be posted on this page with an updated revision date.',
  },
  {
    title: '8. Contact',
    body: 'If you have any questions about this privacy policy, please contact us at support@verifyai.app.',
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-6">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Intro */}
        <div className="rounded-2xl border border-border/60 bg-card p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            At VerifyAI, we are committed to protecting your privacy. This policy explains what data we collect, how we use it, and what choices you have. By using our platform, you agree to the practices described below.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="font-semibold text-lg mb-3">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
