"use client";

import React, { useMemo } from "react";
import { useScheduleStore } from "@/stores/scheduleStore";
import { PERIODS } from "@/lib/constants";
import H1 from "./H1";
import { Button } from "../ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "../ui/popover";
import { format } from "date-fns";

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
        <div className="p-4 bg-gray-300">
            <div className="flex items-center justify-between mb-2">
                <H1>Lessons</H1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    Max = {maxMeetings}
                </span>
            </div>

            {/* Per-section summary */}
            {/* Per-section summary (one per line) */}
            {sections.length > 0 && (
                <ul className="mb-3 mt-10 space-y-1 text-md font-bold">
                    {sections.map((s) => {
                        const n = perSectionCounts.get(s) ?? 0;
                        return (
                            <li key={s} className="flex items-center gap-3">
                                <span className="shrink-0">{s}:</span>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="secondary" size="sm" className="font-medium">
                                            {n} {n === 1 ? "Meeting" : "Meetings"}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-72" align="start">
                                        {/* placeholder for now — we’ll render the real list next step */}
                                        <div className="text-sm">
                                            <div className="font-semibold mb-1">{s} — Meetings</div>
                                            <p className="text-muted-foreground">
                                                List with meeting number + date goes here.
                                            </p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </li>
                        );
                    })}
                </ul>
            )}
            {maxMeetings === 0 && (
                <p className="text-sm text-muted-foreground">
                    No meetings to list yet. Add sections, pick dates, assign periods, and exclude holidays.
                </p>
            )}
        </div>
    );
}
