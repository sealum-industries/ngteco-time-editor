import type { TimeSheet, TimeSheetEmployees, TimeSheetTimes } from '@prisma/client';

export type WithChildren<T = unknown> = T & { children?: React.ReactNode };
export type WithChildrenPropType = { children?: React.ReactNode };

export type GenericObjectType = Record<string, unknown>;
export type StringObjectType = Record<string, string>;

export type ActionDataBaseType<T> = T & {
  success: Boolean;
  error?: unknown;
};

export type TimeSheetTimesType = TimeSheetTimes;

export type TimeSheetEmployeesType = TimeSheetEmployees & {
  times: Array<TimeSheetTimesType>;
};

export type TimeSheetType = TimeSheet & {
  employees: Array<TimeSheetEmployeesType>;
};

export type TimeSheetTimesQueryType = Pick<
  TimeSheetTimes,
  'day' | 'date' | 'in' | 'out' | 'note' | 'total_calc' | 'total_proper'
>;

export type TimeSheetEmployeesQueryType = Pick<TimeSheetEmployees, 'name' | 'total_calc' | 'total_proper'> & {
  times: {
    create: Array<TimeSheetTimesQueryType>;
  };
};

export type TimeSheetQueryType = Pick<TimeSheet, 'pp_from' | 'pp_to'> & {
  employees: {
    create: Array<TimeSheetEmployeesQueryType>;
  };
};

// export type EmployeeTimesRawDataType = {
//   date: string;
//   day: string;
//   in: string;
//   out: string;
//   note: string;
//   total_calc: number;
//   total_proper: number;
// };

// export type EmployeeRawDataType = {
//   name: string;
//   total_calc: number;
//   total_proper: number;
//   times: Array<EmployeeTimesRawDataType>;
// };

// export type TimeSheetRawDataType = {
//   id: string;
//   pp_from: string;
//   pp_to: string;
//   employees: Array<EmployeeRawDataType>;
// };
