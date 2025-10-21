"use client";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Language } from "@/lib/types";


export default function LanguageSelector() {
    const { courseName, setDisplayName, uiLanguage, setUiLanguage } =
        useScheduleStore();

    const confirm = () => {
        const trimmed = (courseName ?? "").trim();
        if (trimmed) {
            setDisplayName(trimmed)
        };
    };

    return (
        <>
            <Select
                value={uiLanguage}
                onValueChange={(value: Language) => {
                    setUiLanguage(value)
                    console.log(value)
                }}
            >
                <SelectTrigger className="w-[180px] bg-gray-50">
                    <SelectValue placeholder="日本語" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="japanese">日本語</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                </SelectContent>
            </Select>
        </>
    );
}
