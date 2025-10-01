"use client"

import * as React from "react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { DayKey, ScheduleValue } from "@/lib/types"
import { IDX_TO_KEY } from "@/lib/constants"
import { useRangeStore } from "@/stores/rangeStore"

// Mirror your schedule shape: { mon:[1,2], wed:[3], ... }
// export type ScheduleValue = {
//     mon: number[]; tue: number[]; wed: number[]; thu: number[];
//     fri: number[]; sat: number[]; sun: number[];
// }





function dayKeyFromDate(d: Date): DayKey {
    return IDX_TO_KEY[d.getDay()]
}

type Props = {
    days: Date[]                 // inclusive list of dates in range
    schedule?: ScheduleValue     // selected periods per weekday
    title?: string               // optional heading
}

export function ClassMeetingsList({ days, schedule, title = "Classes" }: Props) {

    const { showClassList } = useRangeStore()
    const items = React.useMemo(() => {
        if (!schedule || days.length === 0) return null
        const out: { date: Date; period: number }[] = []
        for (const d of days) {
            const key = dayKeyFromDate(d)
            const periods = schedule[key]
            if (!periods?.length) continue
            for (const p of periods) out.push({ date: d, period: p })
        }
        // Sort by date, then by period number
        out.sort((a, b) => {
            const t = a.date.getTime() - b.date.getTime()
            return t !== 0 ? t : a.period - b.period
        })
        return out
    }, [days, schedule])

    if (items?.length === 0) return null

    return (
        showClassList && <div className=" flex flex-col justify-center items-center rounded-md border p-3 mt-5">
            <div className="mb-2 text-sm text-muted-foreground">
                {title} ({items?.length})
            </div>
            <ol className="space-y-1 text-sm">
                {items?.map((it, i) => (
                    <li
                        key={`${format(it.date, "yyyy-MM-dd")}-${it.period}`}
                        className="rounded bg-accent px-2 py-1"
                    >
                        {`Class ${i + 1}: ${format(it.date, "MMMM d", { locale: enUS })}: Period ${it.period}`}
                    </li>
                ))}
            </ol>
        </div>
    )
}
