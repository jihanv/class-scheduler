"use client"

import Calculator from "@/components/new/main-calculator";
import { useRouter } from "next/navigation";

export default function Home() {

  return (

    <div className="flex-[2] ">
      <Calculator />
    </div>

  );
}