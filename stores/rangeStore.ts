import { create } from "zustand";

type RangeStore = {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
};

export const useRangeStore = create<RangeStore>((set) => ({
  startDate: undefined,
  setStartDate: (date) => {
    console.log(date);
    return set({ startDate: date });
  },
}));
