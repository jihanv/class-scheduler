"use client"

import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"


export default function CalendarTest() {

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setDate(new Date()) // runs only on client
    }, [])

    if (!mounted) return null // or a skeleton

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border"
        />
    )
}
