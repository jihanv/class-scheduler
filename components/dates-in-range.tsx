"use client"

import * as React from "react"
import { format } from "date-fns"
import type { Locale } from "date-fns"
import { enUS } from "date-fns/locale"

export type DaysInRangeProps = {
    /** Inclusive list of dates to render */
    days: Date[]
    /** Optional heading text */
    title?: string
    /** Control the date and weekday formats */
    dateFormat?: string       // default: "yyyy-MM-dd"
    weekdayFormat?: string    // default: "EEE"
    /** Optional locale for deterministic SSR/CSR */
    locale?: Locale           // default: enUS
    /** Optional wrapper className */
    className?: string
}

export function DaysInRange({
    days,
    title = "Days in range",
    dateFormat = "yyyy-MM-dd",
    weekdayFormat = "EEE",
    locale = enUS,
    className,
}: DaysInRangeProps) {
    if (!days.length) return null

    return (
        <div className={`rounded-md border p-3 ${className ?? ""}`}>
            <div className="mb-2 text-sm text-muted-foreground">
                {title} ({days.length}):
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {days.map((d) => {
                    const key = format(d, "yyyy-MM-dd") // stable key
                    const label = `${format(d, dateFormat)} (${format(d, weekdayFormat, { locale })})`
                    return (
                        <li key={key} className="px-2 py-1 rounded bg-accent">
                            {label}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
