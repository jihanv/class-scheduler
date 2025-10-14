"use client"
import React from 'react'
import H1 from './H1'
import { useScheduleStore } from '@/stores/scheduleStore'
import MeetingList from './meeting-list'

export default function InformationDisplay() {


    const { displayName, uiLanguage } = useScheduleStore()
    return (

        <>
            <div className='bg-gray-300 h-dvh p-4'>
                <div className='p-4'>
                    <div className='text-xl'>{uiLanguage === "japanese" ? "授業名" : "Class Name"}</div>
                    <H1 className='text-4xl min-h-[2.5rem]'>{displayName !== "" ? displayName : ""}</H1>
                </div>
                <MeetingList />

                <footer className="mt-10 fixed bottom-10 py-4 text-xs text-muted-foreground  border-muted">
                    © Jihan V. 2025
                    <br />Class Scheduler

                    Beta Version
                </footer>

            </div>

        </>
    )
}
