"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import SelectBar from "@/app/components/SelectBar"
import { Project } from "@/lib/types"

// Helper function to calculate deadline progress based on dates
const calculateDeadlineProgress = (startDate: string, completionDate: string): number => {
  const currentDate = new Date('2025-08-15'); // Current date
  const projectStartDate = new Date(startDate);
  const projectEndDate = new Date(completionDate);
  
  const totalDuration = projectEndDate.getTime() - projectStartDate.getTime();
  const elapsedDuration = currentDate.getTime() - projectStartDate.getTime();
  
  let progress = (elapsedDuration / totalDuration) * 100;
  
  // Ensure progress is between 0 and 100
  progress = Math.max(0, Math.min(100, progress));
  
  return Math.round(progress);
};

// const data: Project[] = [
//   {
//     slNo: 1,
//     projectName: "Smart City Infrastructure Development",
//     startDate: "2024-01-15",
//     stageIIWO: 2500000, // ₹25 Lakhs
//     completionDateAsPerWO: "2025-12-31", // Future date
//     billReleased: 1875000, // ₹18.75 Lakhs (75% of WO amount)
//     deadlineProgress: calculateDeadlineProgress("2024-01-15", "2025-12-31"),
//     remark: "On track, minor delays in material procurement",
//   },
//   {
//     slNo: 2,
//     projectName: "Highway Extension Project Phase II",
//     startDate: "2024-03-01",
//     stageIIWO: 5000000, // ₹50 Lakhs
//     completionDateAsPerWO: "2026-03-15", // Future date
//     billReleased: 0, // No bill released yet
//     deadlineProgress: calculateDeadlineProgress("2024-03-01", "2026-03-15"),
//     remark: "Pending environmental clearance",
//   },
//   {
//     slNo: 3,
//     projectName: "Metro Rail Connectivity",
//     startDate: "2024-02-10",
//     stageIIWO: 7500000, // ₹75 Lakhs
//     completionDateAsPerWO: "2025-11-30", // Future date
//     billReleased: 6750000, // ₹67.5 Lakhs (90% of WO amount)
//     deadlineProgress: calculateDeadlineProgress("2024-02-10", "2025-11-30"),
//     remark: "Ahead of schedule, testing phase initiated",
//   },
//   {
//     slNo: 4,
//     projectName: "Water Treatment Plant Upgrade",
//     startDate: "2024-01-01",
//     stageIIWO: 3000000, // ₹30 Lakhs
//     completionDateAsPerWO: "2025-07-20", // Past date - should be overdue
//     billReleased: 3000000, // ₹30 Lakhs (100% - project completed)
//     deadlineProgress: calculateDeadlineProgress("2024-01-01", "2025-07-20"),
//     remark: "Project completed successfully",
//   },
//   {
//     slNo: 5,
//     projectName: "Digital Governance Platform",
//     startDate: "2024-04-01",
//     stageIIWO: 4000000, // ₹40 Lakhs
//     completionDateAsPerWO: "2025-09-30", // Future date  
//     billReleased: 1200000, // ₹12 Lakhs (30% of WO amount)
//     deadlineProgress: calculateDeadlineProgress("2024-04-01", "2025-09-30"),
//     remark: "Initial development phase, vendor selection pending",
//   },
//   {
//     slNo: 6,
//     projectName: "Renewable Energy Grid Integration",
//     startDate: "2024-01-20",
//     stageIIWO: 6000000, // ₹60 Lakhs
//     completionDateAsPerWO: "2025-06-15", // Past date - should be overdue
//     billReleased: 3600000, // ₹36 Lakhs (60% of WO amount)
//     deadlineProgress: calculateDeadlineProgress("2024-01-20", "2025-06-15"),
//     remark: "Grid testing in progress, facing technical delays",
//   },
// ]

const data : Project[] = []

// export type Project = {
//   slNo: number
//   projectName: string
//   startDate: string // Project start date
//   stageIIWO: number // Amount in rupees
//   completionDateAsPerWO: string
//   billReleased: number // Amount in rupees
//   deadlineProgress: number // Percentage as number based on deadline calculation
//   remark: string
// }

export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "slNo",
    header: "Sl No",
    cell: ({ row }) => <div className="font-medium">{row.getValue("slNo")}</div>,
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name of Project
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("projectName")}</div>,
  },

   {
    accessorKey: "completionDateAsPerWO",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Completion Date as per WO
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("completionDateAsPerWO"))
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "stageIIWO",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stage II WO Amount
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue("stageIIWO") as number
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount)
      return <div className="font-mono text-sm">{formatted}</div>
    },
  },
 
  {
    accessorKey: "billReleased",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bill Released Amount
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const billAmount = row.getValue("billReleased") as number
      const woAmount = row.getValue("stageIIWO") as number
      const percentage = woAmount > 0 ? Math.round((billAmount / woAmount) * 100) : 0
      
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(billAmount)
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatted}</div>
          <div className={`text-xs ${
            billAmount > 0 ? "text-green-600" : "text-red-600"
          }`}>
            {percentage}% of WO
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "deadlineProgress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deadline Progress
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const progress = row.getValue("deadlineProgress") as number
      const completionDate = new Date(row.getValue("completionDateAsPerWO") as string)
      const currentDate = new Date('2025-08-15')
      const isOverdue = currentDate > completionDate && progress < 100
      
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                isOverdue ? 'bg-red-500' : progress >= 100 ? 'bg-red-500' : progress >=50? 'bg-yellow-400' : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <span className={`text-sm font-medium ${
            isOverdue ? 'text-red-600' : progress >= 100 ? 'text-green-600' : 'text-gray-900'
          }`}>
            {progress}%
          </span>
          {isOverdue && (
            <span className="text-xs text-red-500 font-medium">OVERDUE</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "remark",
    header: "Remark",
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate" title={row.getValue("remark")}>
        {row.getValue("remark")}
      </div>
    ),
  },
    {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"))
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      return <div>{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.stageIIWO.toString())}
            >
              Copy WO Amount
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View project details</DropdownMenuItem>
            <DropdownMenuItem>Edit project</DropdownMenuItem>
            <DropdownMenuItem>Update progress</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function ProjectDashboard() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (<>

    <div className="w-[95vw] mx-auto mt-10 bg-background text-foreground">
    <SelectBar/>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter projects..."
          value={(table.getColumn("projectName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("projectName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>

  </>)
}
