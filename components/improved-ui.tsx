"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Checkbox } from "@/components/ui/checkbox";
// import { cn } from "@/lib/utils";
import {
    addDays,
    eachDayOfInterval,
    format,
    isAfter,
    isBefore,
    startOfDay,
    min as minDate,
    max as maxDate,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Download, ListChecks, Sparkles } from "lucide-react";
import { DateButtonProps, WeekdayKey } from "@/lib/types";
import DateButton from "./improved/date-button";
import { weekdays } from "@/lib/constants";
import PeriodGrid from "./new/period-grid";

// --- Helpers ---------------------------------------------------------------


function sameDay(a?: Date, b?: Date) {
    if (!a || !b) return false;
    return a.toDateString() === b.toDateString();
}

// --- Period selection grid -------------------------------------------------

// --- Date button/picker ----------------------------------------------------


// --- Main mockup -----------------------------------------------------------
export default function ImprovedSchedulerMock() {
    const [startDate, setStartDate] = React.useState<Date | undefined>(startOfDay(new Date()));
    const [endDate, setEndDate] = React.useState<Date | undefined>(startOfDay(addDays(new Date(), 14)));
    const [holidays, setHolidays] = React.useState<Date[]>([]);
    const [schedule, setSchedule] = React.useState<Record<WeekdayKey, number[]>>({
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
    });
    const [autoPreview, setAutoPreview] = React.useState(true);

    const rangeDays = React.useMemo(() => {
        if (!startDate || !endDate) return [] as Date[];
        const start = startOfDay(minDate([startDate, endDate]));
        const end = startOfDay(maxDate([startDate, endDate]));
        return eachDayOfInterval({ start, end });
    }, [startDate, endDate]);

    const workingDays = React.useMemo(() => {
        if (!holidays.length) return rangeDays;
        const blocked = new Set(holidays.map((h) => startOfDay(h).getTime()));
        return rangeDays.filter((d) => !blocked.has(startOfDay(d).getTime()));
    }, [rangeDays, holidays]);

    // compute meetings
    const meetings = React.useMemo(() => {
        if (!startDate || !endDate) return [] as { date: Date; period: number }[];
        const out: { date: Date; period: number }[] = [];
        for (const d of workingDays) {
            const w = weekdays[(d.getDay() + 6) % 7] as WeekdayKey; // map JS Sun(0)→Sun etc
            const ps = schedule[w] || [];
            for (const p of ps) out.push({ date: d, period: p });
        }
        out.sort((a, b) => a.date.getTime() - b.date.getTime() || a.period - b.period);
        return out;
    }, [workingDays, schedule, startDate, endDate]);

    const [showResults, setShowResults] = React.useState(true);

    // React.useEffect(() => {
    //     if (autoPreview) setShowResults(true);
    // }, [autoPreview, startDate, endDate, holidays, schedule]);

    return (
        <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Jihan&apos; Term Class Calculator</h1>
                    {/* <p className="text-muted-foreground">Pick a date range, exclude holidays, choose weekly periods, and generate all meeting dates.</p> */}
                </div>
                <div className="hidden md:flex items-center gap-2">
                    {/* <Button variant="outline" size="sm" className="gap-2"><Download className="size-4" />Export CSV</Button> */}
                    {/* <Button size="sm" className="gap-2"><Sparkles className="size-4" />Add to Calendar</Button> */}
                </div>
            </div>

            {/* Stepper */}
            <ol className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
                {["Dates", "Holidays", "Periods", "Results"].map((label, i) => (
                    <li key={label} className="flex items-center gap-3">
                        <div className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {i + 1}
                        </div>
                        <div className="text-sm">
                            <div className="font-medium leading-none">{label}</div>
                            <div className="text-muted-foreground">{i === 0 && "Select range"}{i === 1 && "Pick blackout dates"}{i === 2 && "Choose weekly periods"}{i === 3 && "Review & export"}</div>
                        </div>
                    </li>
                ))}
            </ol>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left column: Inputs */}
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Date range</CardTitle>
                            <CardDescription>Choose the start and end dates for your class run.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <DateButton label="Start date" date={startDate} setDateAction={setStartDate} max={endDate} />
                            <DateButton label="End date" date={endDate} setDateAction={setEndDate} min={startDate} />
                            <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                                {/* <Checkbox id="preview" checked={autoPreview} onCheckedChange={(v) => setAutoPreview(Boolean(v))} /> */}
                                {/* <Label htmlFor="preview" className="text-sm text-muted-foreground">Auto-preview results while editing</Label> */}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Holidays</CardTitle>
                            <CardDescription>Select blackout dates inside the range.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-64 justify-between font-normal">
                                        <span className="inline-flex items-center gap-2"><CalendarIcon className="size-4" />{holidays.length ? `${holidays.length} selected` : "Select holidays"}</span>
                                        <span className="text-muted-foreground">▾</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="multiple"
                                        locale={enUS}
                                        selected={holidays}
                                        onSelect={(d) => setHolidays(d ?? [])}
                                        disabled={(d) => {
                                            if (!startDate || !endDate) return true;
                                            const sd = startOfDay(d);
                                            if (isBefore(sd, startOfDay(minDate([startDate, endDate])))) return true;
                                            if (isAfter(sd, startOfDay(maxDate([startDate, endDate])))) return true;
                                            return false;
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>

                            {holidays.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {holidays.map((h) => (
                                        <Badge key={h.toISOString()} variant="secondary" className="gap-2">
                                            {format(h, "MMM d (EEE)")}
                                            <button
                                                className="-mr-1 rounded px-1 text-muted-foreground hover:text-foreground"
                                                onClick={() => setHolidays(holidays.filter((x) => !sameDay(x, h)))}
                                                aria-label="Remove holiday"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly periods</CardTitle>
                            <CardDescription>Choose which periods meet on which weekdays.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="max-h-[420px] rounded-md">
                                {/* <PeriodGrid value={schedule} onChange={setSchedule} periods={7} /> */}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        {/* <Button size="lg" onClick={() => setShowResults(true)} className="gap-2"><ListChecks className="size-4" />Calculate</Button> */}
                        <Button variant="outline" size="lg" onClick={() => { setHolidays([]); }}>Clear holidays</Button>
                    </div>
                </div>

                {/* Right column: Results */}
                <div className="space-y-6 lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Classes {meetings.length ? `(${meetings.length})` : ""}</CardTitle>
                            <CardDescription>Generated from your inputs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!startDate || !endDate ? (
                                <div className="text-sm text-muted-foreground">Select a start and end date to see results.</div>
                            ) : showResults ? (
                                meetings.length ? (
                                    <ul className="space-y-2 text-sm">
                                        {meetings.map((m, i) => (
                                            <li key={`${format(m.date, "yyyy-MM-dd")}-${m.period}`} className="rounded-md bg-accent px-3 py-2">
                                                <span className="font-medium">Class {i + 1}:</span> {format(m.date, "MMMM d (EEE)")} · Period {m.period}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-sm text-muted-foreground">No meetings in this range with the current settings.</div>
                                )
                            ) : (
                                <div className="text-sm text-muted-foreground">Press “Calculate” to preview results.</div>
                            )}

                            <Separator className="my-4" />
                            {/* <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="w-full"><Download className="mr-2 size-4" />CSV</Button>
                                <Button className="w-full"><Sparkles className="mr-2 size-4" />Calendar</Button>
                            </div> */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
