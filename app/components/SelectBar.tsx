import React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FilterValues, SelectBarProps } from "@/lib/types"

const Selectbar = ({
    filters = {},
    onFiltersChange
} : SelectBarProps) => {


    const handleFilterChange = (key : keyof FilterValues, value: string) => {
        const newFilters = {...filters, [key] : value }
        onFiltersChange?.(newFilters)
    }

    return (<>
        <div className='filter-nav flex gap-2 justify-center items-center bg-background text-foreground'>
            <Select>
                <SelectTrigger className="w-[180px] border-accent">
                    <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="hq">HQ</SelectItem>
                    <SelectItem value="er">ER</SelectItem>
                    <SelectItem value="nr">NR</SelectItem>
                    <SelectItem value="sr">SR</SelectItem>
                    <SelectItem value="wr">WR</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[180px] border-accent">
                    <SelectValue placeholder="Type of Project" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="capital">Capital</SelectItem>
                    <SelectItem value="r&m">R & M</SelectItem>
                    <SelectItem value="stores&spares">Stores & spares</SelectItem>

                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[180px] border-accent">
                    <SelectValue placeholder="Project Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="success">success</SelectItem>

                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[180px] border-accent">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
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
            <Select>
                <SelectTrigger className="w-[180px] border-accent">
                    <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="February">February</SelectItem>
                    <SelectItem value="March">March</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="May">May</SelectItem>
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