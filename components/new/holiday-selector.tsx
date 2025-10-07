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
    const [country, setCountry] = React.useState<"US" | "JP" | "CA">("US");

    function addNationalHolidaysStub() {
        // Step 1: no-op placeholder.
        // We'll implement fetching/deriving the holiday dates in Step 2.
        // Keeping this empty ensures today's change can't break anything.
        console.log("Add national holidays for", country);
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

                                    showOutsideDays={false}

                                    classNames={{
                                        // the container that holds all month calendars
                                        months: "flex flex-wrap justify-between gap-y-8 gap-x-8",

                                        // each month: full width on small screens, half (minus the gap) on md+
                                        month: `flex flex-col max-md:basis-full md:basis-[calc(50%-1rem)] md:shrink-0 md:grow-0 gap-4 border border-border rounded-lg p-4 shadow-sm bg-background`,
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Pick start and end dates first to select holidays.
                            </p>
                        )}
                        {/* Country selector + Add button */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <label htmlFor="country" className="text-sm text-muted-foreground">
                                Country
                            </label>
                            <select
                                id="country"
                                className="h-9 rounded-md border bg-background px-2 text-sm"
                                value={country}
                                onChange={(e) => setCountry(e.target.value as "US" | "JP" | "CA")}
                            >
                                <option value="US">United States</option>
                                <option value="JP">Japan</option>
                                <option value="CA">Canada</option>
                            </select>

                            <Button
                                onClick={addNationalHolidaysStub}
                                disabled={!startDate || !endDate}
                            >
                                Add national holidays
                            </Button>
                        </div>
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
