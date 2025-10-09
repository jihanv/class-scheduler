"use client"

import ClassNameInput from "@/components/new/class-name-input";
import SectionNameInput from "@/components/new/section-name-input";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useRouter } from "next/navigation";

export default function Home() {
    const { sections } = useScheduleStore();
    const router = useRouter();

    return (

        <div className="flex-[2] ">
            <div className="flex flex-col m-5 gap-5 p-10"><SectionNameInput />
                <Button disabled={sections.length === 0} onClick={() => router.push("/setClass")
                }>Next</Button></div>
        </div>

    );
}