// app/components/periods/period-grid.tsx
"use client";

import { PERIODS, getDisplayWeekdays } from "@/lib/constants";
import type { CellCoord, WeekdayKey } from "@/lib/types";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useState } from "react";
import SectionPopover from "./section-popover";

export default function PeriodGrid() {
    const schedule = useScheduleStore((s) => s.schedule);
    const { uiLanguage } = useScheduleStore()
    const [openCell, setOpenCell] = useState<CellCoord | null>(null);

    // 👇 labels for the header, display-only
    const displayWeekdays = getDisplayWeekdays(uiLanguage /*, startOnSunday? */);

    return (
        <div className="rounded-2xl border bg-card">
            <table className="w-full mx-auto table-fixed border-collapse">
                <thead className="sticky top-0 z-10">
                    <tr>
                        {displayWeekdays.map(({ key, label }) => (
                            <th
                                key={key}
                                className="px-3 py-3 text-center text-sm font-medium whitespace-nowrap"
                            >
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {PERIODS.map((p) => (
                        <tr key={p} className="border-t">
                            {displayWeekdays.map(({ key }) => {
                                const day = key as WeekdayKey;
                                const assignedSection = schedule[day]?.[p];

                                return (
                                    <td key={`${key}-${p}`} className="p-2 align-top h-full">
                                        <div className="h-full">
                                            <SectionPopover
                                                day={day}
                                                period={p}
                                                assigned={assignedSection}
                                                open={openCell?.day === day && openCell?.period === p}
                                                onOpenChange={(o) => setOpenCell(o ? { day, period: p } : null)}
                                            />
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
