'use client'

import { motion } from 'framer-motion'
import { FileText, Users, Shield, Zap } from 'lucide-react'

const stats = [
  {
    icon: FileText,
    value: '10,000+',
    label: 'Articles Analyzed',
  },
  {
    icon: Users,
    value: '5,000+',
    label: 'Active Users',
  },
  {
    icon: Shield,
    value: '97%',
    label: 'Accuracy Rate',
  },
  {
    icon: Zap,
    value: '<2s',
    label: 'Avg. Analysis Time',
  },
]

export function StatsSection() {
  return (
    <section className="py-16 border-y border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl md:text-4xl font-bold mb-1">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
