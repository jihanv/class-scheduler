"use client"

import * as React from "react"
import {
    eachDayOfInterval,
    startOfDay,
    min as minDate,
    max as maxDate,
} from "date-fns"
import { DateSelector } from "./date-selector"
import { PeriodSchedule, ScheduleValue } from "./period-schedule"
import { ClassMeetingsList } from "./class-meetings-list"
import { HolidayPicker } from "./holiday-picker"

/** One shadcn-style date picker (popover + button) */


export function RangeSelector() {
    const [startDate, setStartDate] = React.useState<Date | undefined>()
    const [endDate, setEndDate] = React.useState<Date | undefined>()
    const [schedule, setSchedule] = React.useState<ScheduleValue>()
    const [holidays, setHolidays] = React.useState<Date[]>([])



    const days = React.useMemo(() => {
        if (!startDate || !endDate) return []
        const start = startOfDay(minDate([startDate, endDate]))
        const end = startOfDay(maxDate([startDate, endDate]))
        return eachDayOfInterval({ start, end })
    }, [startDate, endDate])

    // Exclude holidays
    const workingDays = React.useMemo(() => {
        if (holidays.length === 0) return days
        const holidaySet = new Set(holidays.map((h) => startOfDay(h).getTime()))
        return days.filter((d) => !holidaySet.has(startOfDay(d).getTime()))
    }, [days, holidays])


    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
                <DateSelector
                    label="Start date"
                    date={startDate}
                    setDate={setStartDate}
                    disabledAfter={endDate}     // optional: prevent picking after the current end
                />
                {startDate && (
                    <DateSelector
                        label="End date"
                        date={endDate}
                        setDate={setEndDate}
                        disabledBefore={startDate}
                    />
                )}

                {/* Show holiday picker once a complete range exists */}
                {startDate && endDate && (
                    <HolidayPicker
                        holidays={holidays}
                        setHolidays={setHolidays}
                        minDate={minDate([startDate, endDate])}
                        maxDate={maxDate([startDate, endDate])}
                    />
                )}
            </div>
            {endDate && <PeriodSchedule
                value={schedule}
                onChange={setSchedule}
                periods={7}
            />}
            {true && <ClassMeetingsList days={workingDays} schedule={schedule} />
            }

        </div>
    )
}
