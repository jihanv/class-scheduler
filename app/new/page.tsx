import ClassNameInput from "@/components/new/class-name-input";
import DateSelector from "@/components/new/date-selector";
import HolidaySelector from "@/components/new/holiday-selector";
import PeriodSelector from "@/components/new/period-selector";
import SectionNameInput from "@/components/new/section-name-input";
import { PeriodSchedule } from "@/components/period-schedule";

export default function Home() {
    return (
        <main className="flex flex-col justify-center items-center gap-5 mt-5">
            <ClassNameInput />
            <SectionNameInput />
            <DateSelector />
            <HolidaySelector />
            <PeriodSelector />
        </main>
    );
}