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
                    <H1 className='text-4xl'>Course:</H1>
                    <p className='mt-3 text-xl font-bold '> {displayName ? displayName : ""}</p>
                </div>
                <div className='p-4'>
                    <H1 className='text-3xl'>Sections:</H1>
                    <ul className="list-disc list-inside space-y-1 mt-3 font-bold">
                        {sections.map((section, index) => (
                            <li key={index} className="text-gray-800">
                                {section}
                            </li>
                        ))}
                    </ul>
                </div>
                <footer className="mt-10 py-4 text-xs text-muted-foreground border-t border-muted">
                    © Jihan V. {new Date().getFullYear()}
                    <br />Class Scheduler

                    Beta Version
                </footer>

            </div>

        </>
    )
}
