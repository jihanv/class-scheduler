import { RangeStore } from "@/lib/types";
import { create } from "zustand";

export const useRangeStore = create<RangeStore>((set) => ({
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

  schedule: undefined,

  showClassList: false,
  setShowClassList: () =>
    set((state) => ({ showClassList: !state.showClassList })),
}));
