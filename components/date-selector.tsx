"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export type DateSelectorProps = {
    title: string
    date: Date | undefined
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export function DateSelector({ title, date, setDate }: DateSelectorProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {title}
            </Label>
            <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                    setDate(date)
                    setOpen(false)
                    console.log(date)
                }}
            />
        </div>
    )
}
