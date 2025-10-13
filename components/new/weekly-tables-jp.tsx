// app/components/weekly/WeeklyTablesJa.tsx
"use client";

import React, { useMemo } from "react";
import { useScheduleStore } from "@/stores/scheduleStore";
import { PERIODS } from "@/lib/constants";
import { badgeColorFor } from "@/lib/utils";
import ExportExcelButtonJa from "./excel-jp-btn";

/** ---- helpers (same logic; JP formatting) ---- */
function startOfWeekMonday(d: Date) {
    const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = copy.getDay(); // 0=Sun .. 6=Sat
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    copy.setDate(copy.getDate() + diff);
    copy.setHours(0, 0, 0, 0);
    return copy;
}
function addDays(base: Date, days: number) {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
}
// e.g. "10月13日（木）"
function formatHeaderJa(d: Date) {
    const yobi = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
    return `${d.getMonth() + 1}月${d.getDate()}日（${yobi}）`;
}
function buildWeeks(start: Date, end: Date) {
    const weeks: { start: Date; days: Date[] }[] = [];
    let cur = startOfWeekMonday(start);
    while (cur <= end) {
        const days = [0, 1, 2, 3, 4, 5].map((i) => addDays(cur, i)); // Mon..Sat
        if (days.some((d) => d >= start && d <= end)) {
            weeks.push({ start: new Date(cur), days });
        }
        cur = addDays(cur, 7);
    }
    return weeks;
}
function dayKeyFromDate(d: Date): "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" {
    const day = d.getDay();
    const KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
    if (day === 0) return "Mon"; // never render Sun; safe fallback
    return KEYS[day - 1];
}
function sameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}
function isHoliday(d: Date, list: Date[]) {
    return list?.some((h) => sameDay(h, d));
}
function dateKey(d: Date) {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function WeeklyTablesJa() {
    const { startDate, endDate, schedule, sections, holidays } = useScheduleStore();
    const showWeeklyPreview = useScheduleStore((s) => s.showWeeklyPreview);

    const weeks = useMemo(
        () => (startDate && endDate ? buildWeeks(startDate, endDate) : []),
        [startDate, endDate]
    );

    const meetingCount = React.useMemo(() => {
        // "YYYY-MM-DD|period" -> 第n回
        const map = new Map<string, number>();
        const perSection = new Map<string, number>();
        const slots: { date: Date; period: number; section: string }[] = [];

        for (const wk of weeks) {
            for (const d of wk.days) {
                if (d < startDate! || d > endDate!) continue;
                if (isHoliday(d, holidays)) continue;
                const key = dayKeyFromDate(d);
                for (const p of PERIODS) {
                    const section = schedule[key]?.[p];
                    if (!section) continue;
                    slots.push({ date: d, period: p, section });
                }
            }
        }

        slots.sort((a, b) => a.date.getTime() - b.date.getTime() || a.period - b.period);

        for (const s of slots) {
            const next = (perSection.get(s.section) ?? 0) + 1;
            perSection.set(s.section, next);
            map.set(`${dateKey(s.date)}|${s.period}`, next);
        }
        return map;
    }, [weeks, startDate, endDate, holidays, schedule]);

    if (!showWeeklyPreview) return null;
    if (!startDate || !endDate) return null;

    return (
        <>
            <ExportExcelButtonJa />
            <section className="w-full max-w-5xl mx-auto mt-4 space-y-6">
                <h2 className="text-xl font-semibold">週間時間割（プレビュー）</h2>

                {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="rounded-2xl border bg-card p-4">
                        <div className="mb-2 text-sm text-muted-foreground">
                            {formatHeaderJa(week.start)} の週 · 月〜土
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 z-10 bg-card text-left text-xs font-medium text-muted-foreground px-3 py-2 border-b">
                                            時限
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
                                                        <div className="font-semibold tracking-tight">
                                                            {formatHeaderJa(d)}
                                                        </div>
                                                        {hol && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                                                                祝日
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
                                                {p}限
                                            </td>

                                            {week.days.map((d, i) => {
                                                const hol = isHoliday(d, holidays);
                                                const outOfRange = d < startDate! || d > endDate!;
                                                const key = dayKeyFromDate(d);
                                                const assigned = schedule[key]?.[p];

                                                const colorClasses =
                                                    !hol && !outOfRange && assigned
                                                        ? badgeColorFor(assigned, sections)
                                                        : "";

                                                const classNum = meetingCount.get(`${dateKey(d)}|${p}`);

                                                const content = hol ? (
                                                    <div className="text-xs leading-tight">
                                                        <div className="font-medium">{p}限</div>
                                                        <div className="text-muted-foreground">祝日</div>
                                                        <div className="text-muted-foreground">第—回</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs leading-tight">
                                                        <div className="font-medium">{p}限</div>
                                                        <div
                                                            className={`text-sm ${assigned ? "font-semibold" : "text-muted-foreground"
                                                                }`}
                                                        >
                                                            {assigned ?? "—"}
                                                        </div>
                                                        <div
                                                            className={`text-xs ${assigned ? "opacity-80" : "text-muted-foreground"
                                                                }`}
                                                        >
                                                            {assigned ? `第${classNum ?? "—"}回` : ""}
                                                        </div>
                                                    </div>
                                                );

                                                return (
                                                    <td key={i} className="align-top px-3 py-2 border-b">
                                                        <div
                                                            className={`rounded-md p-2 ${hol || outOfRange
                                                                ? "bg-muted/40 text-muted-foreground"
                                                                : colorClasses || "bg-background"
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
        </>
    );
}
