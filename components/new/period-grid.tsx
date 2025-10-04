"use client";
// app/components/periods/period-grid.tsx
import { BADGE_COLORS, PERIODS, weekdays } from "@/lib/constants";
import { WeekdayKey } from "@/lib/types";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button"; // if not already

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
        <>
            <div className="rounded-2xl h-[700]border bg-card">
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
                                            <Popover
                                                open={openCell?.day === day && openCell?.p === p}
                                                onOpenChange={(o) => setOpenCell(o ? { day, p } : null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    {/* Use Button with asChild to avoid button-in-button */}
                                                    <Button
                                                        asChild
                                                        className={`w-full h-12 rounded-md border px-2 text-sm flex flex-col items-center justify-start gap-0.5 ${a ? badgeColorFor(a) : "bg-background hover:bg-accent text-muted-foreground"
                                                            }`}
                                                        aria-label={`Select ${day} period ${p}`}
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
                                                </PopoverTrigger>

                                                <PopoverContent className="p-0 w-56" align="start">
                                                    <Command>
                                                        <CommandList>
                                                            <CommandEmpty>No sections. Add some first.</CommandEmpty>

                                                            <CommandGroup heading="Sections">
                                                                {sections.map((s) => (
                                                                    <CommandItem
                                                                        key={s}
                                                                        value={s}
                                                                        onSelect={() => {
                                                                            setSectionForPeriod(day, p, s);
                                                                            setOpenCell(null);
                                                                        }}
                                                                    >
                                                                        {s}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>

                                                            <CommandGroup>
                                                                <CommandItem
                                                                    value="__clear"
                                                                    onSelect={() => {
                                                                        clearPeriod(day, p);
                                                                        setOpenCell(null);
                                                                    }}
                                                                >
                                                                    Clear
                                                                </CommandItem>
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <SectionLegend />
        </>
    );
}
