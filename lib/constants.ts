import { DayKey, ScheduleByDay, WeekdayKey } from "./types";

export const IDX_TO_KEY = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const;

export const DAY_ORDER: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
];

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const PERIODS = [1, 2, 3, 4, 5, 6, 7];

export const weekdayIdx: Record<WeekdayKey, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const BADGE_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-cyan-100 text-cyan-700",
  "bg-indigo-100 text-indigo-700",
  "bg-lime-100 text-lime-700",
  "bg-orange-100 text-orange-700",
];

export type ScheduleMap = Record<WeekdayKey, number[]>;

export const emptySchedule = (): ScheduleByDay => ({
  Mon: {},
  Tue: {},
  Wed: {},
  Thu: {},
  Fri: {},
  Sat: {},
});

export const ROW_HEIGHT_4_LINES = 50;

export const EXCEL_BADGE_PALETTE: Array<{ fill: string; font: string }> = [
  { fill: "FFFDE68A", font: "FF78350F" }, // amber-200 / amber-900
  { fill: "FFA7F3D0", font: "FF064E3B" }, // emerald-200 / emerald-900
  { fill: "FFBFDBFE", font: "FF1E3A8A" }, // blue-200 / blue-900
  { fill: "FFE9D5FF", font: "FF4C1D95" }, // purple-200 / purple-900
  { fill: "FFFECACA", font: "FF7F1D1D" }, // red-200 / red-900
  { fill: "FFD1FAE5", font: "FF065F46" }, // emerald-200-ish / teal-900
  { fill: "FFFDE68A", font: "FF92400E" }, // amber-200 / amber-800
  { fill: "FFD9F99D", font: "FF365314" }, // lime-200 / lime-900
];

export const HOLIDAY_FILL = "FFF3F4F6";
export const HOLIDAY_FONT = "FF6B7280";
