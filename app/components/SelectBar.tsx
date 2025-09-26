import React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FilterValues, SelectBarProps } from "@/lib/types"
import { Button } from "@/components/ui/button"

const Selectbar = ({
    filters = {},
    onFiltersChange
}: SelectBarProps) => {


    const handleFilterChange = (key: keyof FilterValues, value: string) => {
        const newFilters = { ...filters, [key]: value }
        onFiltersChange?.(newFilters)
    }

    return (<>
        <div className='filter-nav flex flex-wrap gap-2 justify-center items-center bg-transparent text-foreground'>
            <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>

                <SelectTrigger className="w-[180px] bg-background border-2 border-accent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">

                    <SelectValue placeholder="Region" />

                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="HQ">HQ</SelectItem>
                    <SelectItem value="ER">ER</SelectItem>
                    <SelectItem value="NR">NR</SelectItem>
                    <SelectItem value="SR">SR</SelectItem>
                    <SelectItem value="WR">WR</SelectItem>
                </SelectContent>
            </Select>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-[180px] bg-background border-2 border-accent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                    <SelectValue placeholder="Type of Project" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="Capital">Capital</SelectItem>
                    <SelectItem value="R & M">R & M</SelectItem>
                    <SelectItem value="Stores & Spares">Stores & spares</SelectItem>

                </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-[180px] bg-background border-2 border-accent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                    <SelectValue placeholder="Project Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="ongoing">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>

                </SelectContent>
            </Select>
            <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                <SelectTrigger className="w-[180px] bg-background border-2 border-accent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                    <SelectItem value="2018">2018</SelectItem>

                </SelectContent>
            </Select>
            <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                <SelectTrigger className="w-[180px] bg-background border-2 border-accent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                    <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All months</SelectItem>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="February">February</SelectItem>
                    <SelectItem value="March">March</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="May">May</SelectItem>
                    <SelectItem value="June">June</SelectItem>
                    <SelectItem value="July">July</SelectItem>
                    <SelectItem value="August">August</SelectItem>
                    <SelectItem value="September">September</SelectItem>
                    <SelectItem value="October">October</SelectItem>
                    <SelectItem value="November">November</SelectItem>
                    <SelectItem value="December">December</SelectItem>

                </SelectContent>
            </Select>
        </div>
    </>)
}


export default Selectbar