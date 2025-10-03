import { weekdays } from "@/lib/constants";
import { WeekdayKey } from "@/lib/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function PeriodGrid({
    periods = 7,
    value,
    onChange,
}: {
    periods?: number;
    value: Record<WeekdayKey, number[]>;
    onChange: (v: Record<WeekdayKey, number[]>) => void;
}) {
    const toggle = (day: WeekdayKey, period: number) => {
        const next = { ...value };
        const set = new Set(next[day] ?? []);
        set.has(period) ? set.delete(period) : set.add(period);
        next[day] = Array.from(set).sort((a, b) => a - b);
        onChange(next);
    };

    return (
        <div className="rounded-2xl border bg-card">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                    <tr>
                        {weekdays.map((w) => (
                            <th key={w} className="px-3 py-3 text-left text-sm font-medium">
                                {w}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: periods }, (_, i) => i + 1).map((p) => (
                        <tr key={p} className="border-t">
                            {weekdays.map((w) => {
                                const selected = value[w]?.includes(p);
                                return (
                                    <td key={w} className="p-2">
                                        <Button
                                            type="button"
                                            variant={selected ? "default" : "outline"}
                                            size="sm"
                                            className={cn("w-full h-9", selected && "shadow")}
                                            aria-pressed={selected}
                                            onClick={() => toggle(w, p)}
                                        >
                                            {p}
                                        </Button>
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
