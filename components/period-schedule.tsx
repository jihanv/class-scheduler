"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DayKey, PeriodScheduleProps, ScheduleValue } from "@/lib/types"
import { DAY_ORDER } from "@/lib/constants"
import { useRangeStore } from "@/stores/rangeStore"
import { useScheduleStore } from "@/stores/scheduleStore"


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
    const { setShowClassList } = useRangeStore();
    const toggle = (day: DayKey, period: number) => {
        setSchedule(prev => {
            const curr = new Set(prev[day] ?? [])
            if (curr.has(period)) {
                curr.delete(period)
            } else {
                curr.add(period)
            } return { ...prev, [day]: Array.from(curr).sort((a, b) => a - b) }
        })
    }
    const { startDate, setStartDate, endDate, setEndDate } = useScheduleStore();
    return (
        (startDate && endDate && <><div className="rounded-md border w-xl mt-5">
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
            <Button className="mt-5" onClick={() => setShowClassList()}>Calculate</Button>
        </>
        ))
}
