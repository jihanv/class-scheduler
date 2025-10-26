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
    if (day === 0) return "Mon"; // we never schedule Sunday; safe fallback
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
    const { startDate, endDate, schedule, sections, holidays, uiLanguage } = useScheduleStore();

    const { perSectionCounts, perSectionMeetings, maxMeetings } = React.useMemo(() => {
        // If we don’t have the basics, return empty results
        if (!startDate || !endDate || sections.length === 0) {
            return {
                perSectionCounts: new Map<string, number>(),
                perSectionMeetings: new Map<string, { date: Date; period: number; meetingNumber: number }[]>(),
                maxMeetings: 0,
            };
        }

        // 1) Walk every day in the chosen range
        const rawSlots: { date: Date; period: number; section: string }[] = [];
        const cur = new Date(startDate);
        const end = new Date(endDate);

        while (cur <= end) {
            const isSunday = cur.getDay() === 0;
            if (!isSunday && !isHoliday(cur, holidays)) {
                const key = dayKeyFromDate(cur);
                for (const p of PERIODS) {
                    const assigned = schedule[key]?.[p];
                    if (assigned) {
                        rawSlots.push({ date: new Date(cur), period: p, section: assigned });
                    }
                }
            }
            cur.setDate(cur.getDate() + 1);
        }

        // 2) Sort strictly by date, then by period (chronological)
        rawSlots.sort((a, b) => a.date.getTime() - b.date.getTime() || a.period - b.period);

        // 3) Build per-section running counts + lists
        const perSectionCounts = new Map<string, number>();
        const perSectionMeetings = new Map<string, { date: Date; period: number; meetingNumber: number }[]>();
        const counters = new Map<string, number>(); // section -> next meeting number

        // initialize for all sections so empty ones still render “0”
        for (const s of sections) {
            perSectionCounts.set(s, 0);
            perSectionMeetings.set(s, []);
            counters.set(s, 0);
        }

        for (const slot of rawSlots) {
            const next = (counters.get(slot.section) ?? 0) + 1;
            counters.set(slot.section, next);

            perSectionCounts.set(slot.section, (perSectionCounts.get(slot.section) ?? 0) + 1);
            perSectionMeetings.get(slot.section)!.push({
                date: slot.date,
                period: slot.period,
                meetingNumber: next,
            });
        }

        // 4) find the maximum to show “Max = …”
        let max = 0;
        for (const [, n] of perSectionCounts) if (n > max) max = n;

        return { perSectionCounts, perSectionMeetings, maxMeetings: max };
    }, [startDate, endDate, sections, schedule, holidays]);
    const items = useMemo(
        () => Array.from({ length: maxMeetings }, (_, i) => i + 1),
        [maxMeetings]
    );



    return (
        <div className="p-4 bg-gray-300">
            <div className="flex items-center justify-between mb-2">
                <H1>Lessons</H1>

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
                                        {(perSectionCounts.get(s) ?? 0) === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No meetings for this section.
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="text-sm font-semibold">{s} — Meetings</div>
                                                <ul className="space-y-1 max-h-60 overflow-auto pr-1">
                                                    {perSectionMeetings.get(s)!.map((m) => (
                                                        <li key={`${s}-${m.meetingNumber}-${m.date.toISOString()}-${m.period}`}>
                                                            <div className="text-sm leading-tight">
                                                                <div className="font-medium">Meeting {m.meetingNumber}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {format(m.date, "yyyy-MM-dd (EEE)")}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </PopoverContent>

                                </Popover>
                            </li>
                        );
                    })}
                </ul>
            )}
            {maxMeetings === 0 && (
                <p className="text-sm text-muted-foreground">
                    {uiLanguage === "japanese" ? "まだ授業が一覧にありません。科目を追加し、日付を選び、時限を割り当てて、休日を除外してください。" : "No meetings to list yet. Add sections, pick dates, assign periods, and exclude holidays."}
                </p>
            )}
        </div>
    );
}
