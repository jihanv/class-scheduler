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

function* weekStartsBetween(start: Date, end: Date) {
    let cur = startOfWeekMonday(start);
    while (cur <= end) {
        yield new Date(cur);
        cur = addDays(cur, 7);
    }
}


export default function ExportExcelButton() {
    const { startDate, endDate, schedule, sections } = useScheduleStore();

    const handleExport = async () => {
        if (!startDate || !endDate) {
            alert("Pick a start and end date first.");
            return;
        }

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Schedule");

        // Column widths (A..G) — set once, used for every week block
        ws.columns = [
            { header: "Period", key: "period", width: 10 },
            { header: "Mon", key: "d1", width: 22 },
            { header: "Tue", key: "d2", width: 22 },
            { header: "Wed", key: "d3", width: 22 },
            { header: "Thu", key: "d4", width: 22 },
            { header: "Fri", key: "d5", width: 22 },
            { header: "Sat", key: "d6", width: 22 },
        ];

        const ROW_HEIGHT_4_LINES = 64;

        let row = 1; // running row pointer

        for (const weekStart of weekStartsBetween(startDate, endDate)) {
            // --- Title row ---
            ws.getCell(row, 1).value = "Weekly Timetable (Week of " + headerLabel(weekStart) + ")";
            ws.getRow(row).font = { bold: true };
            ws.getRow(row).height = 18;
            row += 2; // leave a blank row for spacing (title on row, blank row next)

            // --- Header row: Mon–Sat with dates ---
            const days = [0, 1, 2, 3, 4, 5].map((i) => addDays(weekStart, i)); // Mon..Sat
            ws.getRow(row).values = ["Period", ...days.map((d) => headerLabel(d))];
            ws.getRow(row).font = { bold: true };
            ws.getRow(row).height = 16;

            // Remember header row to add borders later
            const headerRowIndex = row;
            row += 1;

            // --- Body rows: one row per period ---
            const periodStartRow = row;
            for (const p of PERIODS) {
                const r = ws.getRow(row++);
                r.height = ROW_HEIGHT_4_LINES;

                // Period label (col A)
                const periodCell = r.getCell(1);
                periodCell.value = p;
                periodCell.alignment = { vertical: "top", horizontal: "left" };

                // Day cells (B..G)
                days.forEach((d, i) => {
                    const cell = r.getCell(i + 2);

                    // Skip if this date sits outside selected range (first/last week spillover)
                    if (d < startDate || d > endDate) {
                        cell.value = "";
                        cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
                        return;
                    }

                    const key = dayKeyFromDate(d);                 // "Mon".."Sat"
                    const section = schedule[key]?.[p] ?? "";       // e.g., "AB" or ""

                    if (!section) {
                        cell.value = "";
                        cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
                        return;
                    }

                    // Content (still period + section; “Class n” will come next)
                    cell.value = `${p}\n${section}`;
                    cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };

                    // Color to match badge slot
                    const colors = excelColorsForSection(section, sections);
                    if (colors) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: colors.fill },
                        };
                        cell.font = {
                            color: { argb: colors.font },
                            bold: true,
                        };
                    }
                });

                r.commit();
            }
            const periodEndRow = row - 1;

            // --- Borders for this week's block (header + body) ---
            for (let r = headerRowIndex; r <= periodEndRow; r++) {
                for (let c = 1; c <= 7; c++) {
                    ws.getCell(r, c).border = {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    };
                }
            }

            // --- Spacer row between weeks ---
            row += 1;
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
            Export Excel (All Weeks)
        </Button>

    );
}