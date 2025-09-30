"use client"

import * as React from "react"
import {
    format,
    eachDayOfInterval,
    startOfDay,
    min as minDate,
    max as maxDate,
} from "date-fns"
import { DateSelector } from "./date-selector"
import { enUS } from "date-fns/locale"
import { DaysInRange } from "./dates-in-range"

/** One shadcn-style date picker (popover + button) */


export function RangeSelector() {
    const [startDate, setStartDate] = React.useState<Date | undefined>()
    const [endDate, setEndDate] = React.useState<Date | undefined>()

    const days = React.useMemo(() => {
        if (!startDate || !endDate) return []
        const start = startOfDay(minDate([startDate, endDate]))
        const end = startOfDay(maxDate([startDate, endDate]))
        return eachDayOfInterval({ start, end })
    }, [startDate, endDate])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
                <DateSelector
                    label="Start date"
                    date={startDate}
                    setDate={setStartDate}
                    disabledAfter={endDate}     // optional: prevent picking after the current end
                />
                {startDate && (
                    <DateSelector
                        label="End date"
                        date={endDate}
                        setDate={setEndDate}
                        disabledBefore={startDate}
                    />
                )}
            </div>

        </div>
    )
}
