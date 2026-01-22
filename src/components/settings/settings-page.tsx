/**
 * SettingsPage - User preferences and account settings.
 */

import { useState } from 'react'
import {
  Settings,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Mail,
  Building2,
  Phone,
  Calendar,
  Check,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/lib/auth-api'

type Theme = 'dark' | 'light' | 'system'
type DateRange = '7d' | '30d' | '90d' | '1y'

export function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser()

  // Local preferences (stored in localStorage)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme
    return saved || 'dark'
  })

  const [defaultDateRange, setDefaultDateRange] = useState<DateRange>(() => {
    const saved = localStorage.getItem('defaultDateRange') as DateRange
    return saved || '30d'
  })

  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem('emailNotifications')
    return saved !== 'false'
  })

  const [emailDigest, setEmailDigest] = useState(() => {
    const saved = localStorage.getItem('emailDigest')
    return saved !== 'false'
  })

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    // Apply theme to document
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleDateRangeChange = (newRange: DateRange) => {
    setDefaultDateRange(newRange)
    localStorage.setItem('defaultDateRange', newRange)
  }

  const handleEmailNotificationsChange = (enabled: boolean) => {
    setEmailNotifications(enabled)
    localStorage.setItem('emailNotifications', String(enabled))
  }

  const handleEmailDigestChange = (enabled: boolean) => {
    setEmailDigest(enabled)
    localStorage.setItem('emailDigest', String(enabled))
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card/50 border">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    icon={User}
                    label="Full Name"
                    value={`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Not set'}
                  />
                  <ProfileField
                    icon={Mail}
                    label="Email"
                    value={user.email}
                    badge={user.email_verified ? 'Verified' : 'Unverified'}
                    badgeVariant={user.email_verified ? 'success' : 'warning'}
                  />
                  <ProfileField
                    icon={Building2}
                    label="Company"
                    value={user.company_name || 'Not set'}
                  />
                  <ProfileField
                    icon={Phone}
                    label="Phone"
                    value={user.phone || user.phone_number || 'Not set'}
                  />
                  <ProfileField
                    icon={Shield}
                    label="Account Type"
                    value={user.role === 'admin' ? 'Administrator' : 'Client'}
                    badge={user.is_approved ? 'Approved' : 'Pending'}
                    badgeVariant={user.is_approved ? 'success' : 'warning'}
                  />
                  <ProfileField
                    icon={Calendar}
                    label="Member Since"
                    value={new Date(user.created_at).toLocaleDateString()}
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Unable to load profile information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Application Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <Select value={theme} onValueChange={(v) => handleThemeChange(v as Theme)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Default Date Range */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Default Date Range</Label>
                    <p className="text-sm text-muted-foreground">
                      Default time period for analytics
                    </p>
                  </div>
                  <Select value={defaultDateRange} onValueChange={(v) => handleDateRangeChange(v as DateRange)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important alerts via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={handleEmailNotificationsChange}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily summary of activity
                  </p>
                </div>
                <Switch
                  checked={emailDigest}
                  onCheckedChange={handleEmailDigestChange}
                />
              </div>

              <Separator />

              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  For more advanced notification rules and alert configuration, visit the{' '}
                  <a href="/alerts" className="text-primary hover:underline">
                    Alerts page
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/forgot-password">Change Password</a>
                </Button>
              </div>

              <Separator />

              {/* Session Info */}
              <div className="space-y-2">
                <Label className="text-base">Session Information</Label>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Login</span>
                    <span>
                      {user?.last_login_at
                        ? new Date(user.last_login_at).toLocaleString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Account Status</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        user?.is_active
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      )}
                    >
                      {user?.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProfileFieldProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  badge?: string
  badgeVariant?: 'success' | 'warning' | 'default'
}

function ProfileField({
  icon: Icon,
  label,
  value,
  badge,
  badgeVariant = 'default',
}: ProfileFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="flex-1 font-medium">{value}</span>
        {badge && (
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              badgeVariant === 'success' &&
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
              badgeVariant === 'warning' &&
                'bg-amber-500/20 text-amber-400 border-amber-500/30'
            )}
          >
            {badgeVariant === 'success' && (
              <Check className="h-3 w-3 mr-1" />
            )}
            {badge}
          </Badge>
        )}
      </div>
    </div>
  )
}

export default SettingsPage
