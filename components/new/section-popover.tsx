"use client";

import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "../ui/command";
import { Button } from "../ui/button";
import { BADGE_COLORS } from "@/lib/constants";
import { WeekdayKey } from "@/lib/types";
import { useScheduleStore } from "@/stores/scheduleStore";

type SectionPopoverProps = {
    day: WeekdayKey;
    period: number;
    assigned?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function SectionPopover({
    day,
    period,
    assigned,
    open,
    onOpenChange,
}: SectionPopoverProps) {
    const { sections, setSectionForPeriod, clearPeriod } = useScheduleStore();

    const badgeColorFor = (section?: string) => {
        if (!section) return "bg-secondary text-secondary-foreground";
        const i = sections.indexOf(section);
        return i >= 0
            ? BADGE_COLORS[i % BADGE_COLORS.length]
            : "bg-secondary text-secondary-foreground";
    };

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    asChild
                    className={`w-full h-12 rounded-md border px-2 text-sm flex flex-col items-center justify-start gap-0.5 ${assigned
                        ? badgeColorFor(assigned)
                        : "bg-background hover:bg-accent text-muted-foreground"
                        }`}
                    aria-label={`Select ${day} period ${period}`}
                >
                    <div className="w-full h-full flex flex-col items-center justify-start gap-0.5 px-2">
                        <span className="font-medium leading-none">{period}</span>
                        <span className={`text-xs leading-none ${assigned ? "" : "invisible"}`}>
                            {assigned || "placeholder"}
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
                                        setSectionForPeriod(day, period, s);
                                        onOpenChange(false);
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
                                    clearPeriod(day, period);
                                    onOpenChange(false);
                                }}
                            >
                                Clear
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
