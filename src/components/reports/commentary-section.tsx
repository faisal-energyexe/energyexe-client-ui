/**
 * CommentarySection - Display AI-generated commentary with editing capabilities.
 */

import { useState } from 'react'
import {
  Sparkles,
  RefreshCw,
  Edit2,
  Save,
  X,
  Clock,
  FileText,
  Coins,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  type CommentarySection as CommentarySectionType,
  type CommentaryResponse,
  type CommentarySectionType as SectionType,
  SECTION_DISPLAY_NAMES,
  useGenerateCommentary,
  useUpdateCommentary,
} from '@/lib/reports-api'

interface CommentarySectionProps {
  sectionType: SectionType
  commentary?: CommentarySectionType | CommentaryResponse
  windfarmId: number
  startDate: string
  endDate: string
  onGenerate?: () => void
  isGenerating?: boolean
  className?: string
}

export function CommentarySection({
  sectionType,
  commentary,
  windfarmId,
  startDate,
  endDate,
  onGenerate,
  isGenerating,
  className,
}: CommentarySectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState('')
  const generateMutation = useGenerateCommentary()
  const updateMutation = useUpdateCommentary()

  const displayName = SECTION_DISPLAY_NAMES[sectionType]

  const handleGenerate = async () => {
    if (onGenerate) {
      onGenerate()
      return
    }

    await generateMutation.mutateAsync({
      windfarmId,
      request: {
        section_type: sectionType,
        start_date: startDate,
        end_date: endDate,
        regenerate: !!commentary,
      },
    })
  }

  const handleEdit = () => {
    setEditedText(commentary?.commentary_text || '')
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!commentary || !('id' in commentary)) return

    await updateMutation.mutateAsync({
      windfarmId,
      commentaryId: commentary.id,
      data: { commentary_text: editedText },
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedText('')
  }

  const isLoading = isGenerating || generateMutation.isPending

  return (
    <Card className={cn('bg-card/50 backdrop-blur-sm border-border/50', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {displayName}
          </CardTitle>

          <div className="flex items-center gap-2">
            {commentary && 'status' in commentary && (
              <StatusBadge status={commentary.status} />
            )}

            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="h-8 gap-1"
                >
                  {isLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : commentary ? (
                    <RefreshCw className="h-3.5 w-3.5" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {commentary ? 'Regenerate' : 'Generate'}
                </Button>

                {commentary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 gap-1"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                )}
              </>
            )}

            {isEditing && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="h-8 gap-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <CommentarySkeleton />
        ) : !commentary ? (
          <EmptyCommentary onGenerate={handleGenerate} displayName={displayName} />
        ) : isEditing ? (
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[150px] bg-background/50"
            placeholder="Edit commentary..."
          />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {commentary.commentary_text}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/30 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(
                  'generated_at' in commentary
                    ? commentary.generated_at
                    : commentary.created_at
                ).toLocaleDateString()}
              </span>
              <span>
                {'word_count' in commentary
                  ? commentary.word_count
                  : commentary.commentary_text.split(/\s+/).length}{' '}
                words
              </span>
              {'generation_cost_usd' in commentary && (
                <span className="flex items-center gap-1">
                  <Coins className="h-3 w-3" />$
                  {commentary.generation_cost_usd.toFixed(4)}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    draft: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Draft' },
    approved: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Approved' },
    published: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Published' },
  }[status] || { color: 'bg-muted', label: status }

  return (
    <Badge variant="outline" className={cn('text-xs', config.color)}>
      {config.label}
    </Badge>
  )
}

function CommentarySkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[85%]" />
      <Skeleton className="h-4 w-[70%]" />
    </div>
  )
}

interface EmptyCommentaryProps {
  onGenerate: () => void
  displayName: string
}

function EmptyCommentary({ onGenerate, displayName }: EmptyCommentaryProps) {
  return (
    <div className="text-center py-6">
      <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground mb-4">
        No {displayName.toLowerCase()} generated yet.
      </p>
      <Button variant="outline" size="sm" onClick={onGenerate} className="gap-2">
        <Sparkles className="h-4 w-4" />
        Generate with AI
      </Button>
    </div>
  )
}

/**
 * Status selector for commentary.
 */
interface StatusSelectorProps {
  status: string
  onStatusChange: (status: 'draft' | 'approved' | 'published') => void
  disabled?: boolean
}

export function StatusSelector({ status, onStatusChange, disabled }: StatusSelectorProps) {
  return (
    <Select
      value={status}
      onValueChange={(v) => onStatusChange(v as 'draft' | 'approved' | 'published')}
      disabled={disabled}
    >
      <SelectTrigger className="w-32 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="published">Published</SelectItem>
      </SelectContent>
    </Select>
  )
}

/**
 * Compact commentary display.
 */
interface CommentaryCompactProps {
  commentary: CommentarySectionType
}

export function CommentaryCompact({ commentary }: CommentaryCompactProps) {
  const displayName = SECTION_DISPLAY_NAMES[commentary.section_type as SectionType]

  return (
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          {displayName}
        </span>
        <span className="text-xs text-muted-foreground">
          {commentary.word_count} words
        </span>
      </div>
      <p className="text-sm line-clamp-3">{commentary.commentary_text}</p>
    </div>
  )
}
