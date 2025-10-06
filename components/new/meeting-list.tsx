"use client";

import React, { useMemo } from "react";
import { useScheduleStore } from "@/stores/scheduleStore";
import { PERIODS } from "@/lib/constants";

function dayKeyFromDate(d: Date): "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" {
    const day = d.getDay(); // 0=Sun..6=Sat
    const KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
    if (day === 0) return "Mon"; // never scheduling Sundays here; safe fallback
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

    const { perSectionCounts, maxMeetings } = useMemo(() => {
        if (!startDate || !endDate || sections.length === 0) {
            return { perSectionCounts: new Map<string, number>(), maxMeetings: 0 };
        }

        // init counts
        const counts = new Map<string, number>(sections.map((s) => [s, 0]));

        // walk the date range (skip Sundays + holidays)
        const cur = new Date(startDate);
        const end = new Date(endDate);

        while (cur <= end) {
            if (cur.getDay() !== 0 && !isHoliday(cur, holidays)) {
                const dayKey = dayKeyFromDate(cur);
                for (const p of PERIODS) {
                    const assigned = schedule[dayKey]?.[p];
                    if (assigned) counts.set(assigned, (counts.get(assigned) ?? 0) + 1);
                }
            }
            cur.setDate(cur.getDate() + 1);
        }

        let max = 0;
        for (const [, n] of counts) if (n > max) max = n;

        return { perSectionCounts: counts, maxMeetings: max };
    }, [startDate, endDate, schedule, sections, holidays]);

    const items = useMemo(
        () => Array.from({ length: maxMeetings }, (_, i) => i + 1),
        [maxMeetings]
    );

    return (
        <div className="p-4 border-l bg-gray-300 h-full">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Meetings</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    Max = {maxMeetings}
                </span>
            </div>

            {/* Per-section summary */}
            {/* Per-section summary (one per line) */}
            {sections.length > 0 && (
                <ul className="mb-3 space-y-1 text-sm text-rose-950 font-bold">
                    {sections.map((s) => {
                        const n = perSectionCounts.get(s) ?? 0;
                        return (
                            <div key={s}>
                                {s}: {n} {n === 1 ? "Meeting" : "Meetings"}
                            </div>
                        );
                    })}
                </ul>
            )}

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
        </div>
    );
}
