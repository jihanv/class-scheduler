"use client"
import React from 'react'
import H1 from '../H1'
import { useScheduleStore } from '@/stores/scheduleStore';

export default function SectionNameInput() {

    const { displayName } = useScheduleStore();

    return (
        <>
            {displayName &&
                <><H1>
                    Add Sections
                </H1>
                </>}
        </>
    )
}
