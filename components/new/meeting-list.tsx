"use client";

import React, { useMemo } from "react";
import { useScheduleStore } from "@/stores/scheduleStore";
import { PERIODS } from "@/lib/constants";

/** Map a JS Date to your weekday keys ("Mon" | ... | "Sat") */
function dayKeyFromDate(d: Date): "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" {
    const day = d.getDay(); // 0=Sun..6=Sat
    const KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
    if (day === 0) return "Mon"; // we never schedule Sundays; safe fallback
    return KEYS[day - 1];
}

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}
function isHoliday(d: Date, holidays: Date[]) {
    return holidays?.some((h) => sameDay(h, d));
}

export default function MeetingList() {
    const { startDate, endDate, schedule, sections, holidays } = useScheduleStore();

    // Compute max number of meetings across all sections
    const maxMeetings = useMemo(() => {
        if (!startDate || !endDate || sections.length === 0) return 0;

        // Running counts per section
        const perSection = new Map<string, number>(sections.map((s) => [s, 0]));

        // Walk day-by-day, Mon..Sat only, skipping holidays
        const cur = new Date(startDate);
        const end = new Date(endDate);
        while (cur <= end) {
            if (cur.getDay() !== 0) { // skip Sundays
                if (!isHoliday(cur, holidays)) {
                    const dayKey = dayKeyFromDate(cur);
                    for (const p of PERIODS) {
                        const assigned = schedule[dayKey]?.[p];
                        if (assigned) {
                            // increment the counter for the assigned section
                            perSection.set(assigned, (perSection.get(assigned) ?? 0) + 1);
                        }
                    }
                }
            }
            cur.setDate(cur.getDate() + 1);
        }

        // Find the maximum count among sections
        let max = 0;
        for (const [, count] of perSection) {
            if (count > max) max = count;
        }
        return max;
    }, [startDate, endDate, schedule, sections, holidays]);

    // Build [1..N]
    const items = useMemo(
        () => Array.from({ length: maxMeetings }, (_, i) => i + 1),
        [maxMeetings]
    );

    return (
        <aside className="bg-gray-300 h-dvh p-4">
            <h2 className="text-lg font-semibold mb-2">Meetings</h2>

            {maxMeetings === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No meetings to list yet. Add sections, pick dates, assign periods, and exclude holidays.
                </p>
            ) : (
                <ul className="list-disc list-inside space-y-1">
                    {items.map((n) => (
                        <li key={n}>Meeting {n}</li>
                    ))}
                </ul>
            )}
        </aside>
    );
}
