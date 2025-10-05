"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useScheduleStore } from "@/stores/scheduleStore";
import { EXCEL_BADGE_PALETTE, PERIODS, ROW_HEIGHT_4_LINES } from "@/lib/constants";


// ----- helpers -----
function startOfWeekMonday(d: Date) {
    const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = copy.getDay(); // 0=Sun..6=Sat
    const diff = day === 0 ? -6 : 1 - day;
    copy.setDate(copy.getDate() + diff);
    copy.setHours(0, 0, 0, 0);
    return copy;
}
function addDays(base: Date, days: number) {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
}
function headerLabel(d: Date) {
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    return `${wd}, ${mo} ${d.getDate()}`;
}
// Map Date -> your weekday keys ("Mon" | ... | "Sat")
function dayKeyFromDate(d: Date): "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" {
    const day = d.getDay();
    const KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
    if (day === 0) return "Mon"; // we never export Sunday; safe fallback
    return KEYS[day - 1];
}

function excelColorsForSection(section: string, sections: string[]) {
    const i = sections.indexOf(section);
    if (i < 0) return null;
    const slot = EXCEL_BADGE_PALETTE[i % EXCEL_BADGE_PALETTE.length];
    return slot;
}

export default function ExportExcelButton() {
    const { startDate, endDate, schedule, sections } = useScheduleStore();

    const handleExport = async () => {
        if (!startDate || !endDate) {
            alert("Pick a start and end date first.");
            return;
        }

        // ----- build one week (the week containing startDate) -----
        const weekStart = startOfWeekMonday(startDate);
        const days = [0, 1, 2, 3, 4, 5].map((i) => addDays(weekStart, i)); // Mon..Sat

        // ----- workbook / worksheet -----
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Schedule");

        // Title
        ws.getCell("A1").value = "Weekly Timetable (Week of " + headerLabel(weekStart) + ")";
        ws.getRow(1).font = { bold: true };
        ws.getRow(1).height = 18;

        // Column widths + headers (A..G)
        ws.columns = [
            { header: "Period", key: "period", width: 10 },
            { header: headerLabel(days[0]), key: "d1", width: 22 },
            { header: headerLabel(days[1]), key: "d2", width: 22 },
            { header: headerLabel(days[2]), key: "d3", width: 22 },
            { header: headerLabel(days[3]), key: "d4", width: 22 },
            { header: headerLabel(days[4]), key: "d5", width: 22 },
            { header: headerLabel(days[5]), key: "d6", width: 22 },
        ];

        // Put the column headers on row 3 (leave row 2 blank for spacing)
        const headerRow = ws.getRow(3);
        headerRow.values = ["Period", ...days.map((d) => headerLabel(d))];
        headerRow.font = { bold: true };
        headerRow.height = 16;

        // ----- body: one row per period -----
        let rowIndex = 4;
        for (const p of PERIODS) {
            const row = ws.getRow(rowIndex++);
            row.height = ROW_HEIGHT_4_LINES;

            // Period label (col A)
            const periodCell = row.getCell(1);
            periodCell.value = p;
            periodCell.alignment = { vertical: "top", horizontal: "left" };

            // Day cells (B..G)
            days.forEach((d, i) => {
                const cell = row.getCell(i + 2);

                // Skip if outside selected date range (first/last week overflow)
                if (d < startDate || d > endDate) {
                    cell.value = "";
                    return;
                }

                const key = dayKeyFromDate(d);           // "Mon".."Sat"
                const section = schedule[key]?.[p] ?? ""; // e.g., "AB" or ""

                if (!section) {
                    cell.value = "";
                    cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
                    return;
                }

                // Value (still period + section for now)
                cell.value = `${p}\n${section}`;
                cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };

                // NEW: color it like the badge
                const colors = excelColorsForSection(section, sections);
                if (colors) {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: colors.fill },
                    };
                    cell.font = {
                        color: { argb: colors.font },
                        bold: true, // matches the emphasis in the UI
                    };
                }
            });


            row.commit();
        }

        // Thin borders for readability
        const lastRow = rowIndex - 1;
        for (let r = 3; r <= lastRow; r++) {
            for (let c = 1; c <= 7; c++) {
                ws.getCell(r, c).border = {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                };
            }
        }

        // Download
        const buf = await wb.xlsx.writeBuffer();
        const blob = new Blob([buf], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "schedule.xlsx";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Button onClick={handleExport} variant="default">
            Export Excel (One Week)
        </Button>
    );
}