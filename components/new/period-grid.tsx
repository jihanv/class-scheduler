"use client";
// app/components/periods/period-grid.tsx
import { BADGE_COLORS, PERIODS, weekdays } from "@/lib/constants";
import { CellCoord, WeekdayKey } from "@/lib/types";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button"; // if not already
import SectionPopover from "./section-popover";


import SectionLegend from "./section-legends";

export default function PeriodGrid() {
    const sections = useScheduleStore((s) => s.sections);
    const schedule = useScheduleStore((s) => s.schedule);
    const { setShowHolidaySelector, endDate, startDate } = useScheduleStore()

    // remember which cell was clicked
    const [openCell, setOpenCell] = useState<CellCoord | null>(null);

    const disabledNoSections = sections.length === 0;

    // just for this step: local selection value (no saving yet)
    const [tempSelection, setTempSelection] = useState<string>("");

    // helper to read what's assigned to a cell
    const assigned = (day: WeekdayKey, period: number) => schedule[day]?.[period];


    const rows = PERIODS;

    return (
        <>
            <div className="rounded-2xl border bg-card">
                <table className="w-full mx-auto table-fixed border-collapse">
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
                                    const assignedSection = schedule[day]?.[p];

                                    return (
                                        <td key={w} className="p-2 align-top">
                                            <SectionPopover
                                                day={day}
                                                period={p}
                                                assigned={assignedSection}
                                                open={openCell?.day === day && openCell?.period === p}
                                                onOpenChange={(o) => setOpenCell(o ? { day, period: p } : null)}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
}
