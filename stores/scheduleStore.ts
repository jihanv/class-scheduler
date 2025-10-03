import { create } from "zustand";
import {
  startOfDay,
  isAfter,
  isBefore,
  min as minDate,
  max as maxDate,
} from "date-fns";

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
}));
