import ClassNameInput from "@/components/new/class-name-input";
import DateSelector from "@/components/new/date-selector";
import ExportExcelButton from "@/components/new/excel-ex-btn";
import HolidaySelector from "@/components/new/holiday-selector";
import PeriodSelector from "@/components/new/period-selector";
import SectionNameInput from "@/components/new/section-name-input";
import WeeklyTables from "@/components/new/weekly-tables";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialogue";
import { Button } from "../ui/button";
import { useScheduleStore } from "@/stores/scheduleStore";
import { emptySchedule } from "@/lib/constants";

export default function Calculator() {
    const showWeeklyPreview = useScheduleStore(s => s.showWeeklyPreview);
    const setShowWeeklyPreview = useScheduleStore(s => s.setShowWeeklyPreview);
    const { commitPendingHolidays, displayName, sections, startDate, endDate, schedule } = useScheduleStore();
    return (
        <div className="flex flex-col gap-5 p-10">
            <ClassNameInput />
            <SectionNameInput />
            <DateSelector />
            <HolidaySelector />
            <PeriodSelector />
            <Button
                disabled={!displayName?.trim() || !sections || !startDate || !endDate || schedule === emptySchedule()}
                className="w-full"
                onClick={() => {
                    commitPendingHolidays();     // ✅ sync local → global
                    setShowWeeklyPreview(true);  // ✅ open preview dialog
                }}
            >
                Show Schedule
            </Button>

            {/* Your dialog controlled by the store */}
            <Dialog open={showWeeklyPreview} onOpenChange={setShowWeeklyPreview}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Show Weekly Schedule</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-auto p-4">
                        {/* WeeklyTables reads `holidays` (now up to date) */}
                        <WeeklyTables />
                    </div>
                </DialogContent>
            </Dialog>

            <ExportExcelButton />
        </div>
    );
}