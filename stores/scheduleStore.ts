import { create } from "zustand";
import {
  startOfDay,
  isAfter,
  isBefore,
  min as minDate,
  max as maxDate,
} from "date-fns";
import type { ScheduleByDay, WeekdayKey } from "@/lib/types";
import { emptySchedule } from "@/lib/constants";

export type ScheduleStore = {
  courseName: string;
  setCourseName: (name: string) => void;

  displayName: string;
  setDisplayName: (name: string) => void;

  sections: string[];
  addSections: (section: string) => void;

  removeSection: (section: string) => void;

  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;

  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;

  showDateSelector: boolean;
  setShowDateSelector: () => void;

  holidays: Date[];
  setHolidays: (dates: Date[]) => void;

  schedule: ScheduleByDay;

  setSectionForPeriod: (
    day: WeekdayKey,
    period: number,
    section: string | null
  ) => void;
  clearPeriod: (day: WeekdayKey, period: number) => void;
  clearDay: (day: WeekdayKey) => void;
  clearAll: () => void;
};

//    const [holidays, setHolidays] = React.useState<Date[]>([]);

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  displayName: "",
  setCourseName: (name) => set({ courseName: name }),

  courseName: "",
  setDisplayName: (name) => set({ displayName: name }),

  sections: [],
  addSections: (section) => {
    const s = section.trim();
    const { sections } = get();
    if (!s || sections.includes(s) || sections.length >= 10) return false;
    set({ sections: [...sections, s] });
    return true;
  },

  removeSection: (section) =>
    set((state) => ({
      sections: state.sections.filter((s) => s !== section),
    })),
  startDate: undefined,
  setStartDate: (date) => {
    console.log(date);
    return set({ startDate: date });
  },

  endDate: undefined,
  setEndDate: (date) => {
    console.log(date);
    return set({ endDate: date });
  },

  showDateSelector: false,
  setShowDateSelector: () =>
    set((state) => ({
      showDateSelector: !state.showDateSelector,
    })),

  holidays: [],

  setHolidays: (dates) =>
    set((state) => {
      const { startDate, endDate } = state;

      // 1) normalize
      const normalized = (dates ?? [])
        .filter(Boolean)
        .map((d) => startOfDay(d));

      // 2) ensures that even if something outside the range sneaks in (e.g. a user clicks an invalid date in the calendar, or data comes from an import), it will be filtered out
      const clamped =
        startDate && endDate
          ? normalized.filter((d) => {
              const minD = startOfDay(minDate([startDate, endDate]));
              const maxD = startOfDay(maxDate([startDate, endDate]));
              return !isBefore(d, minD) && !isAfter(d, maxD);
            })
          : normalized;

      // 3) Make sure you don’t end up with the same holiday multiple times.
      const unique = Array.from(
        new Map(clamped.map((d) => [d.getTime(), d])).values()
      );

      // 4) sort ascending
      unique.sort((a, b) => a.getTime() - b.getTime());

      return { holidays: unique };
    }),

  // new schedule state:
  schedule: emptySchedule(),

  // set a section for one cell (day+period).
  // pass section = null to clear it (convenience).
  setSectionForPeriod: (day, period, section) =>
    set((state) => {
      // optional guard: only allow known sections
      if (section && !state.sections.includes(section)) {
        return {}; // ignore invalid section
      }

      const dayMap = { ...(state.schedule[day] ?? {}) };
      if (section === null) {
        delete dayMap[period];
      } else {
        dayMap[period] = section;
      }

      return {
        schedule: {
          ...state.schedule,
          [day]: dayMap,
        },
      };
    }),

  clearPeriod: (day, period) =>
    set((state) => {
      const dayMap = { ...(state.schedule[day] ?? {}) };
      delete dayMap[period];
      return { schedule: { ...state.schedule, [day]: dayMap } };
    }),

  clearDay: (day) =>
    set((state) => ({
      schedule: { ...state.schedule, [day]: {} },
    })),

  clearAll: () => set({ schedule: emptySchedule() }),
}));
