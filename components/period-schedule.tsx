"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

const DAY_ORDER: { key: DayKey; label: string }[] = [
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
    { key: "wed", label: "Wed" },
    { key: "thu", label: "Thu" },
    { key: "fri", label: "Fri" },
    { key: "sat", label: "Sat" },
    { key: "sun", label: "Sun" },
]

export type ScheduleValue = Record<DayKey, number[]> // e.g. { mon:[1,2], wed:[3], ... }

export type PeriodScheduleProps = {
    /** Controlled value: which periods are selected for each day */
    value?: ScheduleValue
    /** Uncontrolled initial value */
    defaultValue?: ScheduleValue
    /** Called whenever selection changes */
    onChange?: (next: ScheduleValue) => void
    /** How many periods per day (default 7) */
    periods?: number
    /** Optional: reorder or relabel columns */
    days?: { key: DayKey; label: string }[]
    className?: string
}

const makeEmpty = (): ScheduleValue => ({
    mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
})

export function PeriodSchedule({
    value,
    defaultValue,
    onChange,
    periods = 7,
    days = DAY_ORDER,
    className,
}: PeriodScheduleProps) {
    // Controlled/uncontrolled support
    const [internal, setInternal] = React.useState<ScheduleValue>(defaultValue ?? makeEmpty())
    const schedule = value ?? internal

    const setSchedule = (updater: (prev: ScheduleValue) => ScheduleValue) => {
        const next = updater(schedule)
        if (value === undefined) setInternal(next)
        onChange?.(next)
    }

    const toggle = (day: DayKey, period: number) => {
        setSchedule(prev => {
            const curr = new Set(prev[day] ?? [])
            curr.has(period) ? curr.delete(period) : curr.add(period)
            return { ...prev, [day]: Array.from(curr).sort((a, b) => a - b) }
        })
    }

    return (
        <div className={cn("rounded-md border w-xl", className)}>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {days.map(d => (
                            <th key={d.key} className="p-2 text-sm font-medium">{d.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: periods }, (_, i) => i + 1).map(p => (
                        <tr key={p} className="border-t">
                            {days.map(d => {
                                const selected = (schedule[d.key] ?? []).includes(p)
                                return (
                                    <td key={d.key} className="p-2">
                                        <Button
                                            type="button"
                                            variant={selected ? "default" : "outline"}
                                            size="sm"
                                            className="w-full h-9"
                                            aria-pressed={selected}
                                            aria-label={`${d.label} period ${p}`}
                                            onClick={() => toggle(d.key, p)}
                                        >
                                            {p}
                                        </Button>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
