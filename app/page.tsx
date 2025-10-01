"use client"
import { ClassMeetingsList } from "@/components/class-meetings-list";
import { HolidayPicker } from "@/components/holiday-picker";
import { PeriodSchedule } from "@/components/period-schedule";
import { RangeSelector } from "@/components/range-selector";
import { ScheduleValue } from "@/lib/types";
import { useRangeStore } from "@/stores/rangeStore";
import {
  eachDayOfInterval,
  startOfDay,
  min as minDate,
  max as maxDate,
} from "date-fns"
import React from "react";

export default function Home() {

  const [holidays, setHolidays] = React.useState<Date[]>([])
  const [schedule, setSchedule] = React.useState<ScheduleValue>()
  const { startDate, setStartDate, endDate, setEndDate } = useRangeStore();



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
    <main className="flex flex-col justify-center items-center">
      <RangeSelector />

      {/* Show holiday picker once a complete range exists */}
      <HolidayPicker
        holidays={holidays}
        setHolidaysAction={setHolidays}
      />
      <PeriodSchedule
        value={schedule}
        onChange={setSchedule}
        periods={7}
      />
      <ClassMeetingsList days={workingDays} schedule={schedule} />


    </main>
  );
}
