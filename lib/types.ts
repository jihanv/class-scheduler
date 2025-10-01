import { Locale } from "date-fns";
import { IDX_TO_KEY } from "./constants";

export type RangeStore = {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;

  schedule: ScheduleValue | undefined;
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
  /** (optional) clamp selection to the active range */
  // minDate?: Date;
  // maxDate?: Date;
};
