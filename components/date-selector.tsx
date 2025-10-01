"use client"

import * as React from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    format,
    startOfDay,
    isBefore,
    isAfter,
} from "date-fns"
import { enUS } from "date-fns/locale"
import { DateSelectorProps } from "@/lib/types"


export function DateSelector({
    label,
    date,
    setDateAction,
    disabledBefore,
    disabledAfter,
}: DateSelectorProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col gap-2">
            <Label className="px-1">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-56 justify-between font-normal">
                        <span className="inline-flex items-center gap-2">
                            <CalendarIcon className="size-4" />
                            {date ? format(date, "yyyy-MM-dd (EEE)", { locale: enUS }) : "Select date"}
                        </span>
                        <ChevronDown className="size-4 opacity-70" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        // still the same DayPicker under the hood
                        mode="single"
                        locale={enUS}
                        selected={date}
                        onSelect={(d) => {
                            setDateAction(d)
                            setOpen(false)
                        }}
                        // keep SSR/CSR consistent & restrict invalid days
                        disabled={(d) => {
                            const sd = startOfDay(d)
                            if (disabledBefore && isBefore(sd, startOfDay(disabledBefore))) return true
                            if (disabledAfter && isAfter(sd, startOfDay(disabledAfter))) return true
                            return false
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
