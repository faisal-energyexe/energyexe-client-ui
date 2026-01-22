import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { TurbineUnit } from '@/types/windfarm'
import { cn } from '@/lib/utils'

interface TurbineDataTableProps {
  data: TurbineUnit[]
  isLoading: boolean
}

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  operational: {
    label: 'Operational',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  installing: {
    label: 'Installing',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  decommissioned: {
    label: 'Decommissioned',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
}

export function TurbineDataTable({ data, isLoading }: TurbineDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<TurbineUnit>[]>(
    () => [
      {
        accessorKey: 'code',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Turbine Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">
            {row.getValue('code')}
          </span>
        ),
      },
      {
        accessorKey: 'windfarm',
        header: 'Wind Farm',
        cell: ({ row }) => {
          const windfarm = row.original.windfarm
          if (!windfarm) return <span className="text-muted-foreground">—</span>
          return (
            <Link
              to="/wind-farms/$windfarmId"
              params={{ windfarmId: windfarm.id.toString() }}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              {windfarm.name}
              <ExternalLink className="h-3 w-3" />
            </Link>
          )
        },
      },
      {
        accessorKey: 'turbine_model',
        header: 'Model',
        cell: ({ row }) => {
          const model = row.original.turbine_model
          if (!model) return <span className="text-muted-foreground">—</span>
          return (
            <div className="flex flex-col">
              <span className="font-medium">{model.model}</span>
              <span className="text-xs text-muted-foreground">
                {model.supplier}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: 'rated_power',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Capacity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        accessorFn: (row) => row.turbine_model?.rated_power_kw ?? 0,
        cell: ({ row }) => {
          const kw = row.original.turbine_model?.rated_power_kw
          if (!kw) return <span className="text-muted-foreground">—</span>
          const mw = kw / 1000
          return (
            <span className="font-medium">
              {mw >= 1 ? `${mw.toFixed(1)} MW` : `${kw} kW`}
            </span>
          )
        },
      },
      {
        accessorKey: 'hub_height_m',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Hub Height
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const height = row.getValue('hub_height_m') as number | null
          if (!height) return <span className="text-muted-foreground">—</span>
          return <span>{height.toFixed(1)} m</span>
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string
          const config = statusConfig[status] || {
            label: status || 'Unknown',
            className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
          }
          return (
            <Badge variant="outline" className={cn(config.className)}>
              {config.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'start_date',
        header: 'Start Date',
        cell: ({ row }) => {
          const date = row.getValue('start_date') as string | null
          if (!date) return <span className="text-muted-foreground">—</span>
          return (
            <span className="text-sm">
              {new Date(date).toLocaleDateString()}
            </span>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 25 },
    },
  })

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              {['Turbine Code', 'Wind Farm', 'Model', 'Capacity', 'Hub Height', 'Status', 'Start Date'].map(
                (header) => (
                  <TableHead
                    key={header}
                    className="text-muted-foreground font-semibold"
                  >
                    {header}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i} className="border-border/50">
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-border/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/50 hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No turbines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{' '}
          to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            data.length,
          )}{' '}
          of {data.length} turbines
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-border/50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-border/50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
