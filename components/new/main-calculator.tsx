import ClassNameInput from "@/components/new/class-name-input";
import DateSelector from "@/components/new/date-selector";
import ExportExcelButton from "@/components/new/excel-ex-btn";
import HolidaySelector from "@/components/new/holiday-selector";
import PeriodSelector from "@/components/new/period-selector";
import SectionNameInput from "@/components/new/section-name-input";
import WeeklyTables from "@/components/new/weekly-tables";

export default function Calculator() {
    return (
        <div className="flex flex-col gap-5 p-10">
            <ClassNameInput />
            <SectionNameInput />
            <DateSelector />
            <PeriodSelector />
            <HolidaySelector />
            <ExportExcelButton />
        </div>
    );
}