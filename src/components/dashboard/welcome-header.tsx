import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export function WelcomeHeader() {
  const { user } = useAuth()

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Get first name from user
  const firstName = user?.first_name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Client Portal</span>
          </div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-muted-foreground max-w-md">
            Welcome to your wind farm analytics dashboard. Monitor performance, track generation,
            and gain insights across your portfolio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/wind-farms">
            <Button className="gap-2">
              Explore Wind Farms
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
