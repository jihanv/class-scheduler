"use client";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Button } from "../ui/button";
import H1 from "./H1";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";


export default function ClassNameInput() {
    const { courseName, setCourseName, setDisplayName } =
        useScheduleStore();

    const confirm = () => {
        const trimmed = (courseName ?? "").trim();
        if (trimmed) {
            setDisplayName(trimmed)
        };
    };

    return (
        <>
            <H1>Write Course Name</H1>
            <Input
                className="w-full"
                type="text"
                value={courseName || ""}
                onChange={(e) => {
                    setCourseName(e.target.value);
                }}
                placeholder="e.g. English 101"
            ></Input>

            <Button onClick={() => confirm()} disabled={!courseName?.trim()}>
                Set Course Name
            </Button>
        </>
    );
}
