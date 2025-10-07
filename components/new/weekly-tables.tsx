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
function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function isHoliday(d: Date, list: Date[]) {
    return list?.some((h) => sameDay(h, d));
}

function dateKey(d: Date) {
    // Use local Y-M-D to avoid TZ drift; keeps keys stable
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
export default function WeeklyTables() {
    const { startDate, endDate, schedule, sections, holidays } = useScheduleStore();
    const showWeeklyPreview = useScheduleStore(s => s.showWeeklyPreview);

    // Always call hooks on every render
    const weeks = useMemo(
        () => (startDate && endDate ? buildWeeks(startDate, endDate) : []),
        [startDate, endDate]
    );

    const meetingCount = React.useMemo(() => {
        // Map of "YYYY-MM-DD|<period>" -> class number for that section
        const map = new Map<string, number>();

        // Running counter per section across the term
        const perSection = new Map<string, number>();

        // Flatten all valid meeting slots (chronological domain)
        const slots: { date: Date; period: number; section: string }[] = [];

        for (const wk of weeks) {
            for (const d of wk.days) {
                // Skip outside the chosen range
                if (d < startDate! || d > endDate!) continue;
                // Skip holidays
                if (isHoliday(d, holidays)) continue;

                const dayKey = dayKeyFromDate(d); // "Mon" | ... | "Sat"
                for (const p of PERIODS) {
                    const section = schedule[dayKey]?.[p];
                    if (!section) continue;
                    slots.push({ date: d, period: p, section });
                }
            }
        }

        // Sort strictly by date, then by period (1..N)
        slots.sort(
            (a, b) => a.date.getTime() - b.date.getTime() || a.period - b.period
        );

        // Walk in order, increment per-section counters, and store a lookup for quick render
        for (const s of slots) {
            const next = (perSection.get(s.section) ?? 0) + 1;
            perSection.set(s.section, next);
            map.set(`${dateKey(s.date)}|${s.period}`, next);
        }

        return map;
    }, [weeks, startDate, endDate, holidays, schedule]);


    // You can still early-return after hooks
    if (!showWeeklyPreview) return null;

    if (!startDate || !endDate) return null;

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
                                    <th className="sticky left-0 z-10 bg-card text-left text-xs font-medium text-muted-foreground px-3 py-2 border-b">
                                        Period
                                    </th>
                                    {week.days.map((d, i) => {
                                        const hol = isHoliday(d, holidays);
                                        return (
                                            <th
                                                key={i}
                                                className={`text-left text-xs font-medium px-3 py-2 border-b ${hol ? "bg-muted/70" : "bg-card"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="font-semibold tracking-tight">{formatHeader(d)}</div>
                                                    {hol && (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                                                            Holiday
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>

                            <tbody>
                                {PERIODS.map((p) => (
                                    <tr key={p}>
                                        <td className="sticky left-0 z-10 bg-card align-top px-3 py-2 text-sm font-medium border-b">
                                            {p}
                                        </td>

                                        {week.days.map((d, i) => {
                                            const hol = isHoliday(d, holidays);
                                            const outOfRange = d < startDate! || d > endDate!;
                                            const key = dayKeyFromDate(d);              // "Mon" | ... | "Sat"
                                            const assigned = schedule[key]?.[p];         // e.g., "AB"

                                            // Only color when NOT a holiday and within range
                                            const colorClasses =
                                                !hol && !outOfRange && assigned ? badgeColorFor(assigned, sections) : "";

                                            // Pull precomputed class count (if any)
                                            const classNum = meetingCount.get(`${dateKey(d)}|${p}`);

                                            const content = hol ? (
                                                <div className="text-xs leading-tight">
                                                    <div className="font-medium">{p}</div>
                                                    <div className="text-muted-foreground">Holiday</div>
                                                    <div className="text-muted-foreground">Class —</div>
                                                </div>
                                            ) : (
                                                <div className="text-xs leading-tight">
                                                    <div className="font-medium">{p}</div>
                                                    <div className={`text-sm ${assigned ? "font-semibold" : "text-muted-foreground"}`}>
                                                        {assigned ?? "—"}
                                                    </div>
                                                    <div className={`text-xs ${assigned ? "opacity-80" : "text-muted-foreground"}`}>
                                                        {assigned ? `Meeting ${classNum ?? "—"}` : ""}
                                                    </div>
                                                </div>
                                            );

                                            return (
                                                <td key={i} className="align-top px-3 py-2 border-b">
                                                    <div
                                                        className={`rounded-md p-2 ${hol || outOfRange ? "bg-muted/40 text-muted-foreground" : colorClasses || "bg-background"
                                                            }`}
                                                    >
                                                        {content}
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

