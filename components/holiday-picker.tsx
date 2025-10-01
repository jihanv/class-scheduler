"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { format, startOfDay, isBefore, isAfter, min, max } from "date-fns"
import { enUS } from "date-fns/locale"
import { HolidayPickerProps } from "@/lib/types"
import { useRangeStore } from "@/stores/rangeStore"

export function HolidayPicker({
    holidays,
    setHolidaysAction,
    label = "Holidays",
    // minDate,
    // maxDate,
}: HolidayPickerProps) {
    const [open, setOpen] = React.useState(false)
    const count = holidays.length
    const { startDate, endDate } = useRangeStore();

    return (
        startDate && endDate && (<div className="flex flex-col items-center justify-center mt-8"><div className="flex flex-col gap-2">
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
                            if (min([startDate, endDate]) && isBefore(sd, startOfDay(min([startDate, endDate])))) return true
                            if (max([startDate, endDate]) && isAfter(sd, startOfDay(max([startDate, endDate])))) return true
                            return false
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>{count > 0 && (
            <ul className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-5">
                {holidays.map((h) => {
                    const key = format(h, "yyyy-MM-dd")
                    return (
                        <li key={key} className="rounded bg-accent px-2 py-0.5">
                            {format(h, "MMM d", { locale: enUS })}
                        </li>
                    )
                })}
            </ul>
        )}</div>

        ))
}
