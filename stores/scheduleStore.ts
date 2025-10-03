import { create } from "zustand";

export type ScheduleStore = {
  courseName: string;
  setCourseName: (name: string) => void;

  displayName: string;
  setDisplayName: (name: string) => void;

  sections: string[];
  addSections: (section: string) => void;

  removeSection: (section: string) => void;
};

export const useScheduleStore = create<ScheduleStore>((set) => ({
  displayName: "",
  setCourseName: (name) => set({ courseName: name }),

  courseName: "",
  setDisplayName: (name) => set({ displayName: name }),

  sections: [],
  addSections: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),
  removeSection: (section) =>
    set((state) => ({
      sections: state.sections.filter((s) => s !== section),
    })),
}));
