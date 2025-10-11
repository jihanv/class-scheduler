"use client";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Button } from "../ui/button";
import H1 from "./H1";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Language } from "@/lib/types";


export default function ClassNameInput() {
    const { courseName, setCourseName, setDisplayName, uiLanguage, setUiLanguage } =
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
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="日本語" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="japanese">日本語</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                </SelectContent>
            </Select>

            <H1>{uiLanguage === "japanese" ? "授業名を入力してください" : "Write Course Name"}</H1>
            <Input
                className="w-full"
                type="text"
                value={courseName || ""}
                onChange={(e) => {
                    setCourseName(e.target.value);
                }}
                placeholder={uiLanguage === "japanese" ? "例: 英語論理表現 III" : "e.g. English 101"}
            ></Input>

            <Button onClick={() => confirm()} disabled={!courseName?.trim()}>
                {uiLanguage === "japanese" ? "授業名を確定" : "Set Course Name"}
            </Button>
        </>
    );
}
