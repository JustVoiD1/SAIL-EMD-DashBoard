"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FilterValues, Project1, ProjectFormData } from "@/lib/types"
import EditProjectModal from "./EditProjectModal"
import MyLoader from "./MyLoader"
import { toast } from "sonner"



// Helper function to calculate deadline progress based on dates
const calculateDeadlineProgress = (startDate: string, completionDate: string): number => {
  const currentDate = new Date(); // Current date
  const projectStartDate = new Date(startDate);
  const projectEndDate = new Date(completionDate);
  if(projectStartDate == projectEndDate) return 100;

  const totalDuration = projectEndDate.getTime() - projectStartDate.getTime();
  const elapsedDuration = currentDate.getTime() - projectStartDate.getTime();

  let progress = (elapsedDuration / totalDuration) * 100;

  // Ensure progress is between 0 and 100
  progress = Math.max(0, Math.min(100, progress));

  return Math.round(progress);
};







export const createColumns = (
  handleEditProject: (project: Project1) => void,
  handleDeleteProject: (project: Project1) => void,

): ColumnDef<ProjectFormData | any>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="bg-accent"
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
        className="border-accent"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "id",
  //   header: "Sl No",
  //   cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  // },
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
      const percentage = woAmount > 0 ? Math.round(((billAmount / woAmount) * 100) * 10) / 10 : 0

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
      const completionDate = row.getValue("end_date") as string
      const startDate = row.getValue("start_date") as string
      const currentDate = new Date()
      const progress = calculateDeadlineProgress(startDate, completionDate);
      const isOverdue = new Date(currentDate) > new Date(completionDate) && progress < 100

      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isOverdue ? 'bg-red-500' : progress >= 100 ? 'bg-red-500' : progress >= 50 ? 'bg-yellow-400' : 'bg-green-600'
                }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : progress >= 100 ? 'text-red-600' : 'text-foreground'
            }`}>
            {progress}
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
      <div className="max-w-[150px] truncate" title={row.getValue("remark")}>
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project: Project1 = row.original



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
            <DropdownMenuSeparator />
            <DropdownMenuItem><Link href={`/project/${project.id}`}>View project details</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditProject(project)}>Edit project</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteProject(project)}>Delete project</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.stage_ii_wo.toString())}
            >
              Copy WO Amount
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface ProjectsTableProps {
  projects: Project1[]
  searchValue?: string
  selectBarFilters?: FilterValues
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  onTableInstanceReady?: (table: any) => void
  projectsLoading: boolean
}

export default function ProjectsTable({
  projects,
  searchValue = "",
  selectBarFilters = {},
  columnVisibility: externalColumnVisibility,
  onColumnVisibilityChange,
  onTableInstanceReady,
  projectsLoading
}: ProjectsTableProps) {

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project1 | null>(null)
  // setData(projects);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(externalColumnVisibility || {})
  const [rowSelection, setRowSelection] = useState({})


  const handleEditProject = useCallback((project: Project1) => {
    // console.log('HandleEditProject: ', project)
    setEditingProject(project)
    setEditModalOpen(true)
  }, [editingProject])

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false)
    setEditingProject(null)
  }, [])

  const handleProjectUpdated = useCallback(() => {
    handleCloseEditModal()
    window.location.reload();
  }, [handleCloseEditModal])


  const handleDeleteProject = useCallback(async (project: Project1) => {
    if (!window.confirm(`Are you sure you want to delete "${project.title}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${project.id}`, 
        {
          method : 'DELETE',
          headers : {
            "Authorization" : `Bearer ${token}`
          }
        }
      );

      if(response.ok){
        const result = await response.json();
        if(result.success){
          window.location.reload();
          toast.info('Project Deleted Successfully');
        }
        else{
          throw new Error('Failed to delete Project');
        }
      }
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete Projeect');
    }

  }, [])

  const columns = useMemo(() => createColumns(handleEditProject, handleDeleteProject), [handleEditProject, handleDeleteProject])

  // update the data array
  const data = useMemo(() => {
    if (!projects) {

      return [];
    }

    let filteredData = [...projects]

    if (selectBarFilters?.region && selectBarFilters.region !== "all") {
      filteredData = filteredData.filter(p => p.region === selectBarFilters.region)
    }
    if (selectBarFilters?.type && selectBarFilters.type !== "all") {
      filteredData = filteredData.filter(p => p.type === selectBarFilters.type)
    }
    if (selectBarFilters?.status && selectBarFilters.status !== "all") {
      filteredData = filteredData.filter(p => p.status === selectBarFilters.status)
    }
    if (selectBarFilters?.year && selectBarFilters.year !== "all") {
      filteredData = filteredData.filter(p => {
        const projectYear = new Date(p.end_date).getFullYear().toString()
        return projectYear === selectBarFilters.year;
      })
    }
    if (selectBarFilters?.month && selectBarFilters.month !== "all") {
      filteredData = filteredData.filter(p => {
        const projectMonth = new Date(p.start_date).toLocaleString('default', { month: 'long' })
        return projectMonth === selectBarFilters.month;
      })
    }

    return filteredData;

  }, [projects,
    selectBarFilters?.region,
    selectBarFilters?.type,
    selectBarFilters?.status,
    selectBarFilters?.year,
    selectBarFilters?.month,
  ]);

  // Handle external column visibility changes
  useEffect(() => {
    if (externalColumnVisibility) {
      setColumnVisibility(externalColumnVisibility)
    }
  }, [externalColumnVisibility])



  // Handle column visibility changes

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      if (typeof updaterOrValue === 'function') {
        setSorting(updaterOrValue);
      } else {
        setSorting(updaterOrValue);
      }
    },
    [],
  )

  const handleColumnFiltersChange = useCallback(
    (updaterOrValue: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
      if (typeof updaterOrValue === 'function') {
        setColumnFilters(updaterOrValue);
      } else {
        setColumnFilters(updaterOrValue);
      }
    },
    [],
  )
  const handleRowSelectionChange = useCallback(
    (updaterOrValue: Record<string, boolean> | ((old: Record<string, boolean>) => Record<string, boolean>)) => {
      if (typeof updaterOrValue === 'function') {
        setRowSelection(updaterOrValue);
      } else {
        setRowSelection(updaterOrValue);
      }
    },
    [],
  )

  const handleColumnVisibilityChange = useCallback(
    (updaterOrValue: VisibilityState | ((old: VisibilityState) => VisibilityState)) => {
      if (typeof updaterOrValue === 'function') {
        setColumnVisibility(updaterOrValue);
      } else {
        setColumnVisibility(updaterOrValue);
      }
    },
    []
  )



  // Sync column visibility with parent component
  useEffect(() => {
    onColumnVisibilityChange?.(columnVisibility)
  }, [columnVisibility, onColumnVisibilityChange])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: handleRowSelectionChange,
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
                  {projectsLoading ? <MyLoader content="Fetching Projects..."/> : 'No Results'}
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
    <EditProjectModal
    key={editingProject?.id || 'new-edit-modal'}
      isOpen={editModalOpen}
      onClose={handleCloseEditModal}
      onProjectUpdated={handleProjectUpdated}
      project={editingProject}
    />

  </>)
}
