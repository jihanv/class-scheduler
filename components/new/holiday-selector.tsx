"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import {
    format,
    isAfter,
    isBefore,
    startOfDay,
    min as minDate,
    max as maxDate,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Calendar as CalendarIcon } from "lucide-react";

function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

function monthsBetweenInclusive(a: Date, b: Date) {
    const y = b.getFullYear() - a.getFullYear();
    const m = b.getMonth() - a.getMonth();
    return y * 12 + m + 1; // inclusive count
}

export default function HolidaySelector() {
    const { startDate, endDate, holidays, setHolidays, showHolidaySelector, setShowHolidaySelector } =
        useScheduleStore();

    function sameDay(a?: Date, b?: Date) {
        if (!a || !b) return false;
        return a.toDateString() === b.toDateString();
    }

    return (
        <>

            {showHolidaySelector && <>
                <Card>
                    <CardHeader>
                        <CardTitle>Holidays</CardTitle>
                        <CardDescription>
                            Select blackout dates inside the range.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {startDate && endDate ? (
                            <div className="overflow-x-auto">
                                <Calendar
                                    mode="multiple"
                                    month={startOfMonth(startDate)}
                                    numberOfMonths={monthsBetweenInclusive(
                                        startOfMonth(startDate),
                                        startOfMonth(endDate)
                                    )}
                                    selected={holidays}
                                    onSelect={(d) => setHolidays(d ?? [])}
                                    disabled={(d) => {
                                        const sd = startOfDay(minDate([startDate, endDate]));
                                        const ed = startOfDay(maxDate([startDate, endDate]));
                                        const day = startOfDay(d);
                                        return isBefore(day, sd) || isAfter(day, ed);
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Pick start and end dates first to select holidays.
                            </p>
                        )}

                        <div className="mt-4 flex items-center gap-2">
                            <Button variant="secondary" onClick={() => setHolidays([])}>
                                Clear All
                            </Button>

                        </div>

                        {holidays.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {holidays.map((h) => (
                                    <Badge key={h.toISOString()} variant="secondary" className="gap-2">
                                        {format(h, "MMM d (EEE)")}
                                        <button
                                            className="-mr-1 rounded px-1 text-muted-foreground hover:text-foreground"
                                            onClick={() =>
                                                setHolidays(holidays.filter((x) => x.toDateString() !== h.toDateString()))
                                            }
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
                <Button>Set Your Schedule</Button>
            </>}
        </>
    );
}
