import { createFileRoute } from '@tanstack/react-router'
import { DataExportCenter } from '@/components/export'

export const Route = createFileRoute('/_protected/export')({
  component: ExportPage,
})

function ExportPage() {
  return (
    <div className="p-6 lg:p-8">
      <DataExportCenter />
    </div>
  )
}
