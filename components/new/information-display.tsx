"use client"
import React from 'react'
import H1 from '../H1'
import { useScheduleStore } from '@/stores/scheduleStore'

export default function InformationDisplay() {


    const { displayName, sections, endDate, startDate } = useScheduleStore()
    return (

        <>
            <div className='bg-gray-300 h-dvh p-4'>
                <div className='p-4'>
                    <H1>Course: {displayName ? displayName : ""}</H1>
                </div>
                <div className='p-4'>
                    <H1>Sections:</H1>
                    <ul className="list-disc list-inside space-y-1">
                        {sections.map((section, index) => (
                            <li key={index} className="text-gray-800">
                                {section}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* <div className='p-4'>
                    <H1>Dates:</H1>
                </div> */}
            </div>
        </>
    )
}
