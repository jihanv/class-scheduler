

"use client"
import { useScheduleStore } from '@/stores/scheduleStore';
import { Button } from '../ui/button';
import H1 from '../H1';

export default function ClassNameInput() {

    const { courseName, setCourseName, displayName, setDisplayName } = useScheduleStore();

    const confirm = () => {
        const trimmed = (courseName ?? "").trim();
        if (trimmed) setDisplayName(trimmed);
    };

    return (
        <>
            <H1>Write Class Name</H1>
            <input
                className='bg-gray-100 w-lg'
                type="text"
                value={courseName || ""}
                onChange={(e) => {
                    setCourseName(e.target.value)
                }
                }
                placeholder="e.g. Communication English"
            ></input >

            <Button onClick={() => confirm()} disabled={!courseName?.trim()}>Set Course Name</Button>

            {displayName && <H1>{displayName}</H1>}
        </>
    )
}
