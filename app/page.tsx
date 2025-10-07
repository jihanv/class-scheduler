"use client"

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/new/dialogue";
import InformationDisplay from "@/components/new/information-display";
import Calculator from "@/components/new/main-calculator";
import MeetingList from "@/components/new/meeting-list";
import WeeklyTables from "@/components/new/weekly-tables";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useScheduleStore } from "@/stores/scheduleStore";

export default function Home() {
  const showWeeklyPreview = useScheduleStore(s => s.showWeeklyPreview);
  const setShowWeeklyPreview = useScheduleStore(s => s.setShowWeeklyPreview);
  const { holidays, setHolidays } = useScheduleStore();
  return (
    <main className="flex flex-row w-full">
      <div className="flex-[0.75] sticky top-0 h-screen overflow-auto">
        <InformationDisplay />
      </div>
      <div className="flex-[2]">
        <Calculator />
      </div>
      <div className="flex-[0.75] sticky top-0 h-screen overflow-auto">
        <MeetingList />
      </div>


    </main>
  );
}