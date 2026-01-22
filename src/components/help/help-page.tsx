/**
 * HelpPage - Help center with documentation, FAQs, and support resources.
 */

import { useState } from 'react'
import {
  HelpCircle,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Keyboard,
  Info,
  Mail,
  Wind,
  BarChart3,
  FileText,
  Bell,
  Map,
  FolderHeart,
  Scale,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I navigate to a specific wind farm?',
    answer:
      'Use the Wind Farms page from the sidebar to see all available wind farms. You can search by name, filter by country or status, and click on any farm to view its detailed analytics.',
  },
  {
    category: 'Getting Started',
    question: 'What does capacity factor mean?',
    answer:
      'Capacity factor is the ratio of actual energy output over a period of time to the maximum possible output if the wind farm operated at full capacity continuously. A capacity factor of 30% means the farm generated 30% of its theoretical maximum output.',
  },
  {
    category: 'Analytics',
    question: 'How is generation data calculated?',
    answer:
      'Generation data is sourced from official grid operators (ENTSOE, Elexon, etc.) and aggregated hourly. The data goes through quality checks and is normalized to ensure accuracy across different sources.',
  },
  {
    category: 'Analytics',
    question: 'What are peer comparisons?',
    answer:
      'Peer comparisons allow you to benchmark a wind farm against similar farms. You can compare by bidzone (same market area), country, owner, or turbine model to understand relative performance.',
  },
  {
    category: 'Reports',
    question: 'How do I generate a report?',
    answer:
      'Navigate to any wind farm and click on the "Report" tab. You can customize the date range and peer groups, then export the report as PDF. For quick access, use the Reports Center to select any farm.',
  },
  {
    category: 'Alerts',
    question: 'How do I set up alerts?',
    answer:
      'Go to the Alerts page from the sidebar. Click "Create Alert Rule" to define conditions like capacity factor thresholds. You can choose to receive notifications in-app, via email, or as a daily digest.',
  },
  {
    category: 'Portfolios',
    question: 'What are portfolios?',
    answer:
      'Portfolios allow you to group wind farms for easier tracking. Create watchlists for farms you\'re monitoring, or organize by ownership. Portfolio analytics show aggregate performance across all included farms.',
  },
  {
    category: 'Data',
    question: 'How often is data updated?',
    answer:
      'Generation data is typically updated daily with a 1-2 day lag from the source. Weather data is updated hourly. Market prices are updated as they become available from the respective exchanges.',
  },
]

interface FeatureDoc {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

const featureDocs: FeatureDoc[] = [
  {
    title: 'Wind Farms',
    description: 'Browse and analyze individual wind farm performance',
    icon: Wind,
    href: '/wind-farms',
  },
  {
    title: 'Analytics',
    description: 'Portfolio-level generation, revenue, and weather analytics',
    icon: BarChart3,
    href: '/analytics/generation',
  },
  {
    title: 'Reports',
    description: 'Generate comprehensive performance reports',
    icon: FileText,
    href: '/reports',
  },
  {
    title: 'Portfolios',
    description: 'Create and manage wind farm collections',
    icon: FolderHeart,
    href: '/portfolios',
  },
  {
    title: 'Comparison',
    description: 'Compare multiple wind farms side by side',
    icon: Scale,
    href: '/comparison',
  },
  {
    title: 'Alerts',
    description: 'Set up performance monitoring and notifications',
    icon: Bell,
    href: '/alerts',
  },
  {
    title: 'Map',
    description: 'Geographic view of all wind farms',
    icon: Map,
    href: '/map',
  },
]

interface ShortcutItem {
  keys: string[]
  description: string
}

const shortcuts: ShortcutItem[] = [
  { keys: ['Ctrl', 'K'], description: 'Open command palette (coming soon)' },
  { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
  { keys: ['Ctrl', '/'], description: 'Focus search' },
  { keys: ['Esc'], description: 'Close modal or dropdown' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
]

export function HelpPage() {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to a backend
    setContactSubmitted(true)
    setTimeout(() => {
      setContactName('')
      setContactEmail('')
      setContactMessage('')
      setContactSubmitted(false)
    }, 3000)
  }

  const categories = [...new Set(faqItems.map((item) => item.category))]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <HelpCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
          <p className="text-muted-foreground">
            Documentation, FAQs, and support resources
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - FAQs */}
        <div className="lg:col-span-2 space-y-6">
          {/* FAQs */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.map((category) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {category}
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {faqItems
                      .filter((item) => item.category === category)
                      .map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category}-${index}`}
                          className="border border-border/50 rounded-lg px-4"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Feature Documentation */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Feature Documentation
              </CardTitle>
              <CardDescription>
                Learn about the platform's capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featureDocs.map((doc) => (
                  <a
                    key={doc.title}
                    href={doc.href}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <doc.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{doc.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {doc.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Need help? Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contactSubmitted ? (
                <div className="text-center py-6">
                  <div className="p-3 rounded-full bg-emerald-500/10 w-fit mx-auto mb-3">
                    <Mail className="h-6 w-6 text-emerald-500" />
                  </div>
                  <p className="font-medium">Message Sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="How can we help?"
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-primary" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex}>
                          <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-muted-foreground">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Version Info */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <Badge variant="secondary">1.0.0</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Environment</span>
                  <Badge variant="outline">Production</Badge>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  EnergyExe Client Portal
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  © 2024 EnergyExe. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
