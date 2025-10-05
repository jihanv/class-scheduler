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

export default function HolidaySelector() {
    const { startDate, endDate, holidays, setHolidays, showHolidaySelector } =
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
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-64 justify-between font-normal"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <CalendarIcon className="size-4" />
                                        {holidays.length
                                            ? `${holidays.length} selected`
                                            : "Select holidays"}
                                    </span>
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
                                        if (isBefore(sd, startOfDay(minDate([startDate, endDate]))))
                                            return true;
                                        if (isAfter(sd, startOfDay(maxDate([startDate, endDate]))))
                                            return true;
                                        return false;
                                    }}
                                />
                            </PopoverContent>
                        </Popover>

                        {holidays.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {holidays.map((h) => (
                                    <Badge
                                        key={h.toISOString()}
                                        variant="secondary"
                                        className="gap-2"
                                    >
                                        {format(h, "MMM d (EEE)")}
                                        <button
                                            className="-mr-1 rounded px-1 text-muted-foreground hover:text-foreground"
                                            onClick={() =>
                                                setHolidays(holidays.filter((x) => !sameDay(x, h)))
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
