"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import PeriodGrid from "./period-grid";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Button } from "../ui/button";

export default function PeriodSelector() {
    const { startDate, endDate, showPeriodSelector, sections, displayName, setShowHolidaySelector } = useScheduleStore();
    return (
        <>
            {showPeriodSelector && <Card>
                <CardHeader>
                    <CardTitle>Weekly periods</CardTitle>
                    <CardDescription>Choose which periods meet on which weekdays.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="rounded-md">
                        <PeriodGrid />
                    </ScrollArea>
                </CardContent>
            </Card>}

        </>
    );
}
