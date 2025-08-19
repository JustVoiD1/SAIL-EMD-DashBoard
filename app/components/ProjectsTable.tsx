"use client"

import { useState, useCallback, useEffect } from "react"
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
import Link from "next/link"
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
//   {
//     slNo: 7,
//     projectName: "Urban Traffic Management System",
//     startDate: "2024-05-10",
//     stageIIWO: 2000000, // ₹20 Lakhs
//     completionDateAsPerWO: "2025-10-15",
//     billReleased: 1000000, // ₹10 Lakhs (50%)
//     deadlineProgress: calculateDeadlineProgress("2024-05-10", "2025-10-15"),
//     remark: "Installation of surveillance units ongoing",
//   },
//   {
//     slNo: 8,
//     projectName: "Rural Electrification Expansion",
//     startDate: "2023-12-01",
//     stageIIWO: 4500000, // ₹45 Lakhs
//     completionDateAsPerWO: "2025-08-10", // Just passed
//     billReleased: 3375000, // ₹33.75 Lakhs (75%)
//     deadlineProgress: calculateDeadlineProgress("2023-12-01", "2025-08-10"),
//     remark: "Final phase completed, awaiting inspection",
//   },
//   {
//     slNo: 9,
//     projectName: "Smart Irrigation Network",
//     startDate: "2024-06-01",
//     stageIIWO: 5500000, // ₹55 Lakhs
//     completionDateAsPerWO: "2026-01-15",
//     billReleased: 2750000, // ₹27.5 Lakhs (50%)
//     deadlineProgress: calculateDeadlineProgress("2024-06-01", "2026-01-15"),
//     remark: "Pilot installations under review",
//   },
//   {
//     slNo: 10,
//     projectName: "Municipal Solid Waste Management",
//     startDate: "2024-02-20",
//     stageIIWO: 3500000, // ₹35 Lakhs
//     completionDateAsPerWO: "2025-12-01",
//     billReleased: 2450000, // ₹24.5 Lakhs (70%)
//     deadlineProgress: calculateDeadlineProgress("2024-02-20", "2025-12-01"),
//     remark: "Procurement completed, site works ongoing",
//   },
//   {
//     slNo: 11,
//     projectName: "e-Learning Infrastructure for Schools",
//     startDate: "2024-07-01",
//     stageIIWO: 2500000, // ₹25 Lakhs
//     completionDateAsPerWO: "2025-10-31",
//     billReleased: 500000, // ₹5 Lakhs (20%)
//     deadlineProgress: calculateDeadlineProgress("2024-07-01", "2025-10-31"),
//     remark: "Hardware procurement in progress",
//   },
//   {
//     slNo: 12,
//     projectName: "Public Wi-Fi Expansion Project",
//     startDate: "2024-01-05",
//     stageIIWO: 3000000, // ₹30 Lakhs
//     completionDateAsPerWO: "2025-08-15", // Yesterday
//     billReleased: 2700000, // ₹27 Lakhs (90%)
//     deadlineProgress: calculateDeadlineProgress("2024-01-05", "2025-08-15"),
//     remark: "Almost complete, final testing remaining",
//   },
// ]

// const data : Project[] = []



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
    accessorKey: "id",
    header: "Sl No",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
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
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("title")}</div>,
  },

  {
    accessorKey: "end_date",
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
      const date = new Date(row.getValue("end_date"))
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "stage_ii_wo",
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
      const amount = row.getValue("stage_ii_wo") as number
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount)
      return <div className="font-mono text-sm">{formatted}</div>
    },
  },

  {
    accessorKey: "bill_released",
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
      const billAmount = row.getValue("bill_released") as number
      const woAmount = row.getValue("stage_ii_wo") as number
      const percentage = woAmount > 0 ? Math.round((billAmount / woAmount) * 100) : 0

      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(billAmount)

      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatted}</div>
          <div className={`text-xs ${billAmount > 0 ? "text-green-600" : "text-red-600"
            }`}>
            {percentage}% of WO
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "deadline_progress",
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
      const progress = row.getValue("deadline_progress") as number
      const completionDate = new Date(row.getValue("end_date") as string)
      const currentDate = new Date('2025-08-15')
      const isOverdue = currentDate > completionDate && progress < 100

      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isOverdue ? 'bg-red-500' : progress >= 100 ? 'bg-red-500' : progress >= 50 ? 'bg-yellow-400' : 'bg-green-600'
                }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : progress >= 100 ? 'text-green-600' : 'text-foreground'
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
    accessorKey: "start_date",
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
      const date = new Date(row.getValue("start_date"))
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      return <div>{formatted}</div>
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const project = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(project.stageIIWO.toString())}
  //           >
  //             Copy WO Amount
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View project details</DropdownMenuItem>
  //           <DropdownMenuItem>Edit project</DropdownMenuItem>
  //           <DropdownMenuItem>Update progress</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]

interface ProjectsTableProps {
  projects : any
  searchValue?: string
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  onTableInstanceReady?: (table: any) => void
}

export default function ProjectsTable({
  projects,
  searchValue = "",
  columnVisibility: externalColumnVisibility,
  onColumnVisibilityChange,
  onTableInstanceReady
}: ProjectsTableProps) {
  const [data, setData] = useState<Project[]>(projects)
  console.log('Data : ',data)
  // setData(projects);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(externalColumnVisibility || {})
  const [rowSelection, setRowSelection] = useState({})

  // update the data array
  useEffect(() => {
  setData(projects || []);
}, [projects]);

  // Handle external column visibility changes
  useEffect(() => {
    if (externalColumnVisibility) {
      setColumnVisibility(externalColumnVisibility)
    }
  }, [externalColumnVisibility])

  console.log(projects)
  // Handle column visibility changes
  const handleColumnVisibilityChange = useCallback((updaterOrValue: any) => {
    if (typeof updaterOrValue === 'function') {
      // If it's an updater function, call it with current state
      setColumnVisibility(updaterOrValue)
    } else {
      // If it's a direct value
      setColumnVisibility(updaterOrValue)
    }
  }, [])

  // Sync column visibility with parent component
  useEffect(() => {
    onColumnVisibilityChange?.(columnVisibility)
  }, [columnVisibility, onColumnVisibilityChange])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Share table instance with parent
  useEffect(() => {
    onTableInstanceReady?.(table)
  }, [table, onTableInstanceReady])

  // Update table filter when searchValue prop changes
  useEffect(() => {
    const projectNameColumn = table.getColumn("title")
    if (projectNameColumn) {
      projectNameColumn.setFilterValue(searchValue)
    }
  }, [searchValue, table])

  return (<>

    <div className="w-full mx-auto bg-background text-foreground">
      {/* <div className="flex items-center py-4">
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
      </div> */}
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
                        <Link href={'/demoproject'}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                        </Link>
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
