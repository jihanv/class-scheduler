"use client"

import * as React from "react"
import { format } from "date-fns"
import { DateSelector } from "./date-selector"

export function RangeSelector() {
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)

    // Helper: drop time (normalize to local midnight)
    const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

    // Build the inclusive list of dates between start & end
    const daysInRange = React.useMemo(() => {
        if (!startDate || !endDate) return []

        let a = atMidnight(startDate)
        let b = atMidnight(endDate)
        // ensure a <= b
        if (a > b) [a, b] = [b, a]

        const out: Date[] = []
        // iterate day by day
        for (let cur = a; cur <= b;) {
            out.push(new Date(cur))
            // advance 1 day safely
            const next = new Date(cur)
            next.setDate(next.getDate() + 1)
            cur = next
        }
        return out
    }, [startDate, endDate])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3">
                <DateSelector title="Start Date" date={startDate} setDate={setStartDate} />
                <DateSelector title="End Date" date={endDate} setDate={setEndDate} />
            </div>

            {/* List the dates when both ends are picked */}
            {daysInRange.length > 0 && (
                <div className="rounded-md border p-3">
                    <div className="mb-2 text-sm text-muted-foreground">
                        {`Days in range (${daysInRange.length}):`}
                    </div>
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {daysInRange.map((d) => (
                            <li key={d.toISOString()} className="px-2 py-1 rounded bg-accent">
                                {format(d, "yyyy-MM-dd")}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
