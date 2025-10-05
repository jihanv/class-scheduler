"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
export default function ExportExcelButton() {
    const handleExport = async () => {
        // 1) New workbook + sheet
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Schedule");
        ws.getColumn(1).width = 28;
        ws.getColumn(1).alignment = { wrapText: true };


        // 2) Put some demo text
        ws.getCell("A1").value = "Weekly Timetables (Demo)";
        ws.getCell("A3").value = "Colored cell below:";

        // 3) Color a cell to prove styling works
        const c = ws.getCell("A5");
        c.value = "AB (Example)";
        c.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFDE68A" }, // light yellow (ARGB: AARRGGBB)
        };
        c.font = { color: { argb: "FF713F12" }, bold: true }; // darker text

        // 4) Download
        const buf = await wb.xlsx.writeBuffer();
        const blob = new Blob([buf], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "schedule.xlsx");
    };

    return (
        <Button onClick={handleExport} variant="default">
            Export Excel (All Weeks)
        </Button>
    );
}
