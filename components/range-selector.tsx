"use client"

import React, { useState } from 'react'
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

export default function RangeSelector() {

    // State
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });


    // Handler to select date range
    return (
        <div className="p-3 text-sm opacity-70">
            <Calendar
                mode="range"
                selected={dateRange}
                numberOfMonths={2}
            /></div>
    )
}
