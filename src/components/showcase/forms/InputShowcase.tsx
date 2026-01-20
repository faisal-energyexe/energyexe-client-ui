import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function InputShowcase() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">Text Input</Label>
          <Input id="text" placeholder="Enter text..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Input</Label>
          <Input id="email" type="email" placeholder="email@example.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password Input</Label>
          <Input id="password" type="password" placeholder="Enter password" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Number Input</Label>
          <Input id="number" type="number" placeholder="0" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="disabled">Disabled Input</Label>
          <Input id="disabled" disabled placeholder="Disabled" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="readonly">Read-only Input</Label>
          <Input id="readonly" readOnly defaultValue="Read-only value" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="search">Search Input</Label>
          <Input id="search" type="search" placeholder="Search turbines..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textarea">Textarea</Label>
          <Textarea id="textarea" placeholder="Enter description..." rows={3} />
        </div>
      </div>
    </div>
  )
}
