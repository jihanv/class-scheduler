"use client";

import React, { useMemo } from "react";
import { useScheduleStore } from "@/stores/scheduleStore";
import { PERIODS } from "@/lib/constants";
import { badgeColorFor } from "@/lib/utils";

/**
 * Utility: get Monday of the week for a given date
 */
function startOfWeekMonday(d: Date) {
    const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = copy.getDay(); // 0=Sun .. 6=Sat
    const diff = day === 0 ? -6 : 1 - day; // shift so Monday is start
    copy.setDate(copy.getDate() + diff);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

function addDays(base: Date, days: number) {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
}

function formatHeader(d: Date) {
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    return `${wd}, ${mo} ${d.getDate()}`;
}

/**
 * Build a list of Monday-start weeks between start and end
 */
function buildWeeks(start: Date, end: Date) {
    const weeks: { start: Date; days: Date[] }[] = [];
    let cur = startOfWeekMonday(start);
    while (cur <= end) {
        const days = [0, 1, 2, 3, 4, 5].map((i) => addDays(cur, i));; // Mon..Sat
        // include only if week intersects range at all
        if (days.some((d) => d >= start && d <= end)) {
            weeks.push({ start: new Date(cur), days });
        }
        cur = addDays(cur, 7);
    }
    return weeks;
}

function dayKeyFromDate(d: Date): "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" {
    // JS: 0=Sun, 1=Mon, ... 6=Sat
    const day = d.getDay();
    const KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
    // If it's Sunday (0), we’ll never render it because our weeks are Mon–Sat,
    // but just in case, fall back to Monday.
    if (day === 0) return "Mon";
    return KEYS[day - 1];
}

export default function WeeklyTables() {
    const { startDate, endDate, schedule, sections } = useScheduleStore();

    // Only show after dates are chosen (matches your existing gating pattern)
    if (!startDate || !endDate) return null;

    const weeks = useMemo(() => buildWeeks(startDate, endDate), [startDate, endDate]);

    return (
        <section className="w-full max-w-5xl mx-auto mt-4 space-y-6">
            <h2 className="text-xl font-semibold">Weekly Timetables (Preview)</h2>

            {weeks.map((week, wIdx) => (
                <div key={wIdx} className="rounded-2xl border bg-card p-4">
                    <div className="mb-2 text-sm text-muted-foreground">
                        Week of {formatHeader(week.start)} · Mon–Sat
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full table-fixed border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    {/* left gutter for 'Period' header; we’ll use it in the next step */}
                                    <th className="sticky left-0 z-10 bg-card text-left text-xs font-medium text-muted-foreground px-3 py-2 border-b">
                                        Period
                                    </th>
                                    {week.days.map((d, i) => (
                                        <th key={i} className="text-left text-xs font-medium px-3 py-2 border-b bg-card">
                                            {formatHeader(d)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {PERIODS.map((p) => (
                                    <tr key={p}>
                                        <td className="sticky left-0 z-10 bg-card align-top px-3 py-2 text-sm font-medium border-b">
                                            {p}
                                        </td>

                                        {week.days.map((d, i) => {
                                            const key = dayKeyFromDate(d);            // "Mon" | "Tue" | ... | "Sat"
                                            const assigned = schedule[key]?.[p];       // e.g., "AB"

                                            // If there's a section, compute its badge classes (bg/text)
                                            const colorClasses = assigned
                                                ? badgeColorFor(assigned, sections)      // returns something like "bg-... text-...":contentReference[oaicite:4]{index=4}
                                                : "";

                                            return (
                                                <td key={i} className="align-top px-3 py-2 border-b">
                                                    <div className={`rounded-md p-2 ${colorClasses || "bg-background"}`}>
                                                        <div className="text-xs leading-tight">
                                                            <div className="font-medium">{p}</div>
                                                            <div className={`text-sm ${assigned ? "font-semibold" : "text-muted-foreground"}`}>
                                                                {assigned ?? "—"}
                                                            </div>
                                                            <div className={`text-xs ${assigned ? "opacity-80" : "text-muted-foreground"}`}>
                                                                Class —
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        })}

                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </section>
    );
}
