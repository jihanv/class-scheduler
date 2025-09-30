"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { format, startOfDay, isBefore, isAfter } from "date-fns"
import { enUS } from "date-fns/locale"

type HolidayPickerProps = {
    holidays: Date[]
    setHolidaysAction: React.Dispatch<React.SetStateAction<Date[]>>
    label?: string
    /** (optional) clamp selection to the active range */
    minDate?: Date
    maxDate?: Date
}

export function HolidayPicker({
    holidays,
    setHolidaysAction,
    label = "Holidays",
    minDate,
    maxDate,
}: HolidayPickerProps) {
    const [open, setOpen] = React.useState(false)
    const count = holidays.length

    return (
        <div className="flex flex-col gap-2">
            <Label className="px-1">{label}</Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-64 justify-between font-normal">
                        <span className="inline-flex items-center gap-2">
                            <CalendarIcon className="size-4" />
                            {count ? `${count} holiday${count > 1 ? "s" : ""} selected` : "Select holidays"}
                        </span>
                        <ChevronDown className="size-4 opacity-70" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="multiple"
                        locale={enUS}
                        selected={holidays}
                        onSelect={(dates) => setHolidaysAction(dates ?? [])}
                        disabled={(d) => {
                            const sd = startOfDay(d)
                            if (minDate && isBefore(sd, startOfDay(minDate))) return true
                            if (maxDate && isAfter(sd, startOfDay(maxDate))) return true
                            return false
                        }}
                    />
                </PopoverContent>
            </Popover>

            {count > 0 && (
                <ul className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {holidays.map((h) => {
                        const key = format(h, "yyyy-MM-dd")
                        return (
                            <li key={key} className="rounded bg-accent px-2 py-0.5">
                                {format(h, "MMM d", { locale: enUS })}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
