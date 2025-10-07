import ClassNameInput from "@/components/new/class-name-input";
import DateSelector from "@/components/new/date-selector";
import ExportExcelButton from "@/components/new/excel-ex-btn";
import HolidaySelector from "@/components/new/holiday-selector";
import PeriodSelector from "@/components/new/period-selector";
import SectionNameInput from "@/components/new/section-name-input";
import WeeklyTables from "@/components/new/weekly-tables";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialogue";
import { Button } from "../ui/button";
import { useScheduleStore } from "@/stores/scheduleStore";

export default function Calculator() {
    const showWeeklyPreview = useScheduleStore(s => s.showWeeklyPreview);
    const setShowWeeklyPreview = useScheduleStore(s => s.setShowWeeklyPreview);
    const { holidays, setHolidays, commitPendingHolidays } = useScheduleStore();
    return (
        <div className="flex flex-col gap-5 p-10">
            <ClassNameInput />
            <SectionNameInput />
            <DateSelector />
            <PeriodSelector />
            <HolidaySelector />
            <Button
                className="w-full mb-2"
                onClick={() => {
                    commitPendingHolidays();     // ✅ sync local → global
                    setShowWeeklyPreview(true);  // ✅ open preview dialog
                }}
            >
                Show Preview
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