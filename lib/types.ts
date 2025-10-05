import { Locale } from "date-fns";
import { IDX_TO_KEY, weekdays } from "./constants";
import { Alignment } from "exceljs";

export type RangeStore = {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;

  schedule: ScheduleValue | undefined;

  showClassList: boolean;
  setShowClassList: () => void;
};

export type ScheduleValue = Record<DayKey, number[]>; // e.g. { mon:[1,2], wed:[3], ... }

export type DayKey = (typeof IDX_TO_KEY)[number];

export type DateSelectorProps = {
  label: string;
  date: Date | undefined;
  setDateAction: (date: Date | undefined) => void;
  /** If provided, dates strictly before this are disabled */
  disabledBefore?: Date;
  /** If provided, dates strictly after this are disabled */
  disabledAfter?: Date;
};

export type DaysInRangeProps = {
  /** Inclusive list of dates to render */
  days: Date[];
  /** Optional heading text */
  title?: string;
  /** Control the date and weekday formats */
  dateFormat?: string; // default: "yyyy-MM-dd"
  weekdayFormat?: string; // default: "EEE"
  /** Optional locale for deterministic SSR/CSR */
  locale?: Locale; // default: enUS
  /** Optional wrapper className */
  className?: string;
};

export type HolidayPickerProps = {
  holidays: Date[];
  setHolidaysAction: React.Dispatch<React.SetStateAction<Date[]>>;
  label?: string;
};

export type PeriodScheduleProps = {
  /** Controlled value: which periods are selected for each day */
  value?: ScheduleValue;
  /** Uncontrolled initial value */
  defaultValue?: ScheduleValue;
  /** Called whenever selection changes */
  onChange?: (next: ScheduleValue) => void;
  /** How many periods per day (default 7) */
  periods?: number;
  /** Optional: reorder or relabel columns */
  days?: { key: DayKey; label: string }[];
  className?: string;
};

export type DateButtonProps = {
  label: string;
  date?: Date;
  setDateAction: (d?: Date) => void;
  min?: Date;
  max?: Date;
};

export type PeriodGridProps = {
  periods?: number;
  value: Record<WeekdayKey, number[]>;
  onChange: (v: Record<WeekdayKey, number[]>) => void;
};

export type WeekdayKey = (typeof weekdays)[number];

// one day’s periods: period number -> section name (or undefined if unassigned)
export type DayPeriods = Record<number, string | undefined>;

// whole week: day key -> DayPeriods
export type ScheduleByDay = Record<WeekdayKey, DayPeriods>;

export type CellCoord = { day: WeekdayKey; period: number };

export type Slot = { date: Date; period: number; section: string };

export const ALIGN_CENTER_MULTI: Readonly<Partial<Alignment>> = {
  vertical: "middle",
  horizontal: "center",
  wrapText: true,
} as const;

export const ALIGN_CENTER_ONE: Readonly<Partial<Alignment>> = {
  vertical: "middle",
  horizontal: "center",
  wrapText: false,
} as const;
