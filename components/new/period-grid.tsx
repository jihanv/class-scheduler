"use client";
// app/components/periods/period-grid.tsx
import { BADGE_COLORS, PERIODS, weekdays } from "@/lib/constants";
import { WeekdayKey } from "@/lib/types";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useState } from "react";
import { Button } from "../ui/button";
import SectionLegend from "./section-legends";

export default function PeriodGrid() {
    const sections = useScheduleStore((s) => s.sections);
    const schedule = useScheduleStore((s) => s.schedule);
    const setSectionForPeriod = useScheduleStore((s) => s.setSectionForPeriod);
    const clearPeriod = useScheduleStore((s) => s.clearPeriod);

    // remember which cell was clicked
    const [openCell, setOpenCell] = useState<{
        day: WeekdayKey;
        p: number;
    } | null>(null);
    const getAssigned = (day: WeekdayKey, p: number) =>
        schedule[day]?.[p] ?? undefined;

    const disabledNoSections = sections.length === 0;

    // just for this step: local selection value (no saving yet)
    const [tempSelection, setTempSelection] = useState<string>("");

    // helper to read what's assigned to a cell
    const assigned = (day: WeekdayKey, period: number) => schedule[day]?.[period];

    const badgeColorFor = (section?: string) => {
        if (!section) return "bg-secondary text-secondary-foreground";
        const i = sections.indexOf(section);
        return i >= 0
            ? BADGE_COLORS[i % BADGE_COLORS.length]
            : "bg-secondary text-secondary-foreground";
    };

    const rows = PERIODS;

    return (
        <div className="rounded-2xl border bg-card">
            <table className="w-[700px] mx-auto table-fixed border-collapse">
                <thead className="sticky top-0 z-10">
                    <tr>
                        {weekdays.map((w) => (
                            <th
                                key={w}
                                className="px-3 py-3 text-center text-sm font-medium whitespace-nowrap"
                            >
                                {w}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {PERIODS.map((p) => (
                        <tr key={p} className="border-t">
                            {weekdays.map((w) => {
                                const day = w as WeekdayKey;
                                const a = assigned(day, p); // ✅ current assignment (string | undefined)

                                return (
                                    <td key={w} className="p-2">
                                        <div className="relative group">
                                            <Button
                                                asChild
                                                className={`w-full h-12 rounded-md border px-2 text-sm flex flex-col items-center justify-start gap-0.5 ${a ? badgeColorFor(a) : "bg-background hover:bg-accent text-muted-foreground"
                                                    }`}
                                            >
                                                <div
                                                    onClick={() => {
                                                        setOpenCell({ day, p });
                                                        setTempSelection(a ?? "");
                                                    }}
                                                >
                                                    <span className="font-medium leading-none">{p}</span>
                                                    <span className={`text-xs leading-none ${a ? "" : "invisible"}`}>
                                                        {a || "placeholder"}
                                                    </span>
                                                </div>
                                            </Button>

                                            {a && (
                                                <Button
                                                    asChild
                                                    className="absolute right-1 top-1 hidden group-hover:flex w-5 h-5 rounded-full bg-black/10 hover:bg-black/20 text-xs"
                                                >
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearPeriod(day, p);
                                                        }}
                                                    >
                                                        ×
                                                    </div>
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <SectionLegend />
            {/* ✅ simple selector panel (only shows when a cell is selected) */}
            {openCell && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Assign section to <strong>{openCell.day}</strong> period{" "}
                        <strong>{openCell.p}</strong>:
                    </span>

                    <select
                        className="border rounded px-2 py-1 text-sm"
                        value={tempSelection}
                        onChange={(e) => {
                            const next = e.target.value;

                            if (next === "__clear") {
                                clearPeriod(openCell.day, openCell.p);
                            } else {
                                setTempSelection(next);
                                setSectionForPeriod(openCell.day, openCell.p, next);
                            }

                            setOpenCell(null);
                        }}
                        disabled={sections.length === 0} // optional UX
                    >
                        <option value="" disabled>
                            {sections.length ? "Choose section…" : "No sections available"}
                        </option>
                        {sections.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                        {/* new clear option */}
                        <option value="__clear">Clear assignment</option>
                    </select>

                    <button
                        className="text-xs text-muted-foreground underline"
                        onClick={() => setOpenCell(null)}
                    >
                        cancel
                    </button>
                </div>
            )}
        </div>
    );
}
