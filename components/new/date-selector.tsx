"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import DateButton from '../improved/date-button'
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
import { useScheduleStore } from '@/stores/scheduleStore';
import { Button } from '../ui/button';

export default function DateSelector() {
    const { startDate, setStartDate, endDate, setEndDate, showDateSelector, setShowHolidaySelector } = useScheduleStore();
    const maxEnd = startDate ? startOfDay(addDays(startDate, 183)) : undefined;

    return (
        <>
            {showDateSelector && <Card>
                <CardHeader>
                    <CardTitle>Date range</CardTitle>
                    <CardDescription>Choose the start and end dates for your class run.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <DateButton label="Start date" date={startDate} setDateAction={setStartDate} max={endDate} />
                    <DateButton label="End date" date={endDate} setDateAction={setEndDate} min={startDate} max={maxEnd} />
                    <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                    </div>
                </CardContent>
            </Card>}


        </>

    )
}
