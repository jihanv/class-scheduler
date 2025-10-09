// app/components/periods/section-legend.tsx
"use client";

import { useScheduleStore } from "@/stores/scheduleStore";
import { badgeColorFor } from "@/lib/utils";

export default function SectionLegend() {
    const sections = useScheduleStore((s) => s.sections);

    if (sections.length === 0) return null;

    return (
        <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-1">Legend:</span>
            {sections.map((s, i) => (
                <span
                    key={s}
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeColorFor(s, sections)}`}
                >
                    {s}
                </span>
            ))}
        </div>
    );
}
