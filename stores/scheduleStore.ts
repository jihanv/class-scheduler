import { create } from "zustand";

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
};

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
}));
