"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import DateButton from './date-button'
import {
    addDays,
    startOfDay,
} from "date-fns";
import { useScheduleStore } from '@/stores/scheduleStore';
import { Button } from '../ui/button';

export default function DateSelector() {
    const { startDate, setStartDate, endDate, setEndDate, showDateSelector, setShowDateSelector, schedule, uiLanguage, sections } = useScheduleStore();
    const maxEnd = startDate ? startOfDay(addDays(startDate, 183)) : undefined;

    const hasAnyAssigned = React.useMemo(() => {
        // schedule shape: schedule[day][period] = sectionName | undefined
        return Object.values(schedule || {}).some(
            (dayMap) => dayMap && Object.values(dayMap).some((v) => !!v)
        )
    }, [schedule])

    return (
        <>
            <Button
                disabled={!hasAnyAssigned || sections.length === 0}
                onClick={() => setShowDateSelector()}
            >

                {uiLanguage === "japanese" ? `日付を選択`
                    : `Select Dates`}
            </Button>
            {showDateSelector && <Card>
                <CardHeader>
                    <CardTitle>{uiLanguage === "japanese" ? `日付範囲` : `Date range`}</CardTitle>
                    <CardDescription>{uiLanguage === "japanese" ? `開始日と終了日を選択してください。`
                        : `Choose the start and end dates for your class run.`}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <DateButton label={uiLanguage === "japanese" ? `開始日` : `Start date`} date={startDate} setDateAction={setStartDate} max={endDate} />
                    <DateButton label={uiLanguage === "japanese" ? `終了日` : `End date`} date={endDate} setDateAction={setEndDate} min={startDate} max={maxEnd} />
                    <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                    </div>
                </CardContent>
            </Card>}


        </>

    )
}
