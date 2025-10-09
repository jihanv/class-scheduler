"use client"

import ClassNameInput from "@/components/new/class-name-input";
import Calculator from "@/components/new/main-calculator";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const { displayName } = useScheduleStore();
  const router = useRouter();

  return (

    <div className="flex-[2] ">
      <Calculator />
    </div>

  );
}