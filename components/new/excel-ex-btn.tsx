"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // adjust if your path differs
import * as XLSX from "xlsx";

export default function ExportExcelButton() {
    const handleExport = () => {
        // 1) Build a worksheet (for now, just a single cell demo)
        const wsData = [
            ["Weekly Timetables (Demo)"],
            [""],
            ["This is a test file. Next step will add real timetables."],
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 2) Build a workbook and append the sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Schedule");

        // 3) Trigger download
        XLSX.writeFile(wb, "schedule.xlsx");
    };

    return (
        <Button onClick={handleExport} variant="default">
            Export Excel (All Weeks)
        </Button>
    );
}
