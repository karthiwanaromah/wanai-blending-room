import { create } from "zustand";

export const useQuizStore = create((set) => ({
  quizResult: null,

  setQuizResult: (result: any) => set({ quizResult: result }),

  clearQuizResult: () => set({ quizResult: null }),
}));
