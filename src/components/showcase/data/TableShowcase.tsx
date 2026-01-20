'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Search } from 'lucide-react'
import { turbineTableData, statusOptions, type TurbineData, type TurbineStatus } from '@/lib/showcase-data'

type SortKey = keyof TurbineData
type SortDirection = 'asc' | 'desc'

const statusColors: Record<TurbineStatus, string> = {
  running: 'bg-green-500/20 text-green-700 dark:text-green-400',
  maintenance: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  idle: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
  warning: 'bg-red-500/20 text-red-700 dark:text-red-400',
}

export function TableShowcase() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const filteredData = useMemo(() => {
    return turbineTableData
      .filter((turbine) => {
        const matchesSearch =
          search === '' ||
          turbine.name.toLowerCase().includes(search.toLowerCase()) ||
          turbine.site.toLowerCase().includes(search.toLowerCase()) ||
          turbine.id.toLowerCase().includes(search.toLowerCase())
        const matchesStatus =
          statusFilter === 'all' || turbine.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }
        return 0
      })
  }, [search, statusFilter, sortKey, sortDirection])

  const SortButton = ({ column, label }: { column: SortKey; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => handleSort(column)}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search turbines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <SortButton column="id" label="ID" />
              </TableHead>
              <TableHead>
                <SortButton column="name" label="Name" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <SortButton column="site" label="Site" />
              </TableHead>
              <TableHead className="hidden sm:table-cell">Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                <SortButton column="efficiency" label="Efficiency" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((turbine) => (
                <TableRow key={turbine.id}>
                  <TableCell className="font-mono text-sm">{turbine.id}</TableCell>
                  <TableCell className="font-medium">{turbine.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {turbine.site}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {turbine.capacity}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[turbine.status as TurbineStatus]}
                    >
                      {turbine.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {turbine.efficiency > 0 ? `${turbine.efficiency}%` : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {turbineTableData.length} turbines
      </div>
    </div>
  )
}
