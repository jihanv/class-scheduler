"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import PeriodGrid from "./period-grid";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Button } from "../ui/button";

export default function PeriodSelector() {
    const { showPeriodSelector, setShowPeriodSelector, sections, uiLanguage } = useScheduleStore();
    return (
        <>
            <Button
                disabled={sections.length === 0}
                onClick={() => setShowPeriodSelector()}>
                {uiLanguage === "japanese" ? `時限を選択`
                    : `Select Periods`}</Button>
            {showPeriodSelector && <Card>
                <CardHeader>
                    <CardTitle>{uiLanguage === "japanese" ? `週間時限`
                        : `Weekly periods`}</CardTitle>
                    <CardDescription>
                        {uiLanguage === "japanese" ? `曜日ごとに授業が行われる時限を選択してください。`
                            : `Choose which periods meet on which weekdays.`}</CardDescription>
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
