import { prisma } from '~/utils/db.server';
import consola from 'consola';
import type { Prisma, TimeSheet } from '@prisma/client';
import type {
  TimeSheetType,
  TimeSheetEmployeesType,
  TimeSheetTimesType,
  TimeSheetQueryType,
  TimeSheetEmployeesQueryType,
  TimeSheetTimesQueryType,
} from '~/types/global';

export type TimeSheetResultType = {
  success: Boolean;
  error?: unknown;
};

export const deleteTimeSheet = async (id: string): Promise<TimeSheetResultType> => {
  try {
    await prisma.timeSheet.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    consola.error(error);
    return {
      success: false,
      error,
    };
  }
};

export const saveTimeSheet = async (timesheet: TimeSheetType): Promise<TimeSheetResultType> => {
  let deleteTransaction: Prisma.Prisma__TimeSheetClient<TimeSheet, never> | undefined = undefined;

  if (timesheet.id !== 'new') {
    deleteTransaction = prisma.timeSheet.delete({
      where: {
        id: timesheet.id,
      },
    });
  }

  const data: TimeSheetQueryType = {
    pp_from: timesheet.pp_from,
    pp_to: timesheet.pp_to,
    employees: {
      create: [],
    },
  };

  const data_employees: TimeSheetEmployeesQueryType[] = [];

  timesheet.employees.forEach((employee: TimeSheetEmployeesType) => {
    const data_employee: TimeSheetEmployeesQueryType = {
      name: employee.name,
      total_calc: employee.total_calc,
      total_proper: employee.total_proper,
      times: {
        create: [],
      },
    };
    const data_employee_times: TimeSheetTimesQueryType[] = [];

    employee.times.forEach((time: TimeSheetTimesType) => {
      const data_time = {
        day: time.day,
        date: time.date,
        in: time.in,
        out: time.out,
        note: time.note,
        total_calc: time.total_calc,
        total_proper: time.total_proper,
      };

      data_employee_times.push(data_time);
    });

    data_employee.times.create.push(...data_employee_times);

    data_employees.push(data_employee);
  });

  data.employees.create.push(...data_employees);

  consola.info({ data });

  try {
    const saveTransaction = prisma.timeSheet.create({
      data,
    });

    if (deleteTransaction) {
      await prisma.$transaction([deleteTransaction, saveTransaction]);
    } else {
      await prisma.$transaction([saveTransaction]);
    }

    return {
      success: true,
    };
  } catch (error) {
    consola.error(error);
    return {
      success: false,
      error,
    };
  }
};

export type TimeSheetsListResultType = TimeSheetResultType & {
  timesheets?: Array<TimeSheetType>;
};

export const getTimeSheetList = async (): Promise<TimeSheetsListResultType> => {
  try {
    const timesheetlist = await prisma.timeSheet.findMany({
      orderBy: {
        pp_from: 'asc',
      },
    });
    return {
      success: true,
      timesheets: timesheetlist as Array<TimeSheetType>,
    };
  } catch (error) {
    consola.error(error);
    return {
      success: false,
      error,
    };
  }
};

export type TimeSheetLoadResultType = TimeSheetResultType & {
  timesheet?: TimeSheetType | null;
  // | (TimeSheet & {
  //     employees: (TimeSheetEmployees & {
  //       times: TimeSheetTimes[];
  //     })[];
  //   })
  // | null;
};

export const loadTimeSheet = async (id: string): Promise<TimeSheetLoadResultType> => {
  try {
    const timesheet = await prisma.timeSheet.findUnique({
      where: {
        id,
      },
      include: {
        employees: {
          include: {
            times: true,
          },
        },
      },
    });
    return {
      success: true,
      timesheet,
    };
  } catch (error) {
    consola.error(error);
    return {
      success: false,
      error,
    };
  }
};
