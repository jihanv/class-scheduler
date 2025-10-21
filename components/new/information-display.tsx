"use client"
import React from 'react'
import H1 from './H1'
import { useScheduleStore } from '@/stores/scheduleStore'
import MeetingList from './meeting-list'
import LanguageSelector from './language-input'

export default function InformationDisplay() {


    const { displayName, uiLanguage } = useScheduleStore()
    return (

        <>
            <div className='bg-gray-300 h-dvh p-4 pt-20'>
                <LanguageSelector />

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
