import { create } from 'zustand';
import type { TimeSheetType, TimeSheetEmployeesType } from '~/types/global';

interface TimeSheetInterface {
  timesheet: TimeSheetType | undefined;
  setTimesheet: (timesheet: TimeSheetType) => void;
  clearTimesheet: () => void;
  getEmployee: (name: string) => TimeSheetEmployeesType | undefined;
}

export const useTimeSheetStore = create<TimeSheetInterface>()((set, get) => ({
  timesheet: undefined,
  setTimesheet: (timesheet) => set({ timesheet }),
  clearTimesheet: () => set({ timesheet: undefined }),
  getEmployee: (name) => {
    let result = undefined;
    const ts = get().timesheet;
    if (ts) {
      result = ts.employees.find((employee) => employee.name === name);
    }
    return result;
  },
}));
