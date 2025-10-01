"use client"
import { HolidayPicker } from "@/components/holiday-picker";
import { RangeSelector } from "@/components/range-selector";
import { useRangeStore } from "@/stores/rangeStore";
import {
  min as minDate,
  max as maxDate,
} from "date-fns"
import React from "react";

export default function Home() {

  const { startDate, endDate } = useRangeStore();
  const [holidays, setHolidays] = React.useState<Date[]>([])

  return (
    <>
      <RangeSelector />
      <div>

        <HolidayPicker
          holidays={holidays}
          setHolidaysAction={setHolidays}
        // minDate={minDate([startDate, endDate])}
        // maxDate={maxDate([startDate, endDate])}
        />
      </div>


    </>
  );
}
