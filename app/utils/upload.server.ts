import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import type { TimeSheetType, TimeSheetEmployeesType, TimeSheetTimesType } from '~/types/global';

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

type ArrayOfString = Array<string>;

export const uploadTimeCSV = async (filedetails: any): Promise<string> => {
  const dest = path.resolve('__dirname', '..', '..', 'documents', filedetails.name);
  // console.log('filedetails', filedetails);
  fs.copyFileSync(filedetails.filepath, dest);
  return dest;
};

export const processTimeCSV = async (filename: string): Promise<TimeSheetType | undefined> => {
  try {
    const rs = fs.readFileSync(filename);
    // console.log('rs', rs);
    const records = parse(rs, { delimiter: ',', from_line: 2, relax_column_count: true });

    let ppfrom;
    let ppto;

    const timesheet: TimeSheetType = {
      id: 'new',
      pp_from: '',
      pp_to: '',
      employees: [],
    };

    // Make sure all lines have the same amount of fields (8);
    records.forEach((row: ArrayOfString) => {
      while (row.length < 8) {
        row.push('');
      }
    });

    // Get the pay period
    records.some((row: ArrayOfString) => {
      if (row[0] === 'Pay Period') {
        const pp = row[3].split('-');
        ppfrom = dayjs(pp[0], 'YYYYMMDD');
        ppto = dayjs(pp[1], 'YYYYMMDD');
        timesheet.pp_from = ppfrom.format('YYYY-MM-DD');
        timesheet.pp_to = ppto.format('YYYY-MM-DD');
        return true;
      }
      return false;
    });

    let currentEmployee = '';
    let employeeRecord: TimeSheetEmployeesType;
    let employeeActualTotal = 0.0;

    records.forEach((row: ArrayOfString) => {
      const col1 = row[0];
      if (col1 === 'Employee') {
        currentEmployee = row[3].slice(0, row[3].indexOf('(') - 1);
        employeeRecord = {} as TimeSheetEmployeesType;
        employeeRecord['name'] = currentEmployee;
        employeeRecord['times'] = [];
        employeeRecord['total_calc'] = 0.0;
        employeeActualTotal = 0.0;
      }
      if (currentEmployee !== '') {
        if (col1.match(/MON|TUE|WED|THU|FRI|SAT|SUN/g)) {
          let duration_total_hours_punched = 0.0;
          let duration_total_hours_proper = 0.0;

          const time_shift_start = dayjs(`${row[1]} 8:00`, 'YYYYMMDD HH:mm');
          const time_shift_end = dayjs(`${row[1]} 16:30`, 'YYYYMMDD HH:mm');
          const time_7min_start = dayjs(`${row[1]} 8:07`, 'YYYYMMDD HH:mm');
          const time_7min_end = dayjs(`${row[1]} 8:16`, 'YYYYMMDD HH:mm');

          let time_start_punched;
          let time_end_punched;

          // Start Time:
          if (row[2] !== '') {
            time_start_punched = dayjs(`${row[1]} ${row[2]}`, 'YYYYMMDD HH:mm');
            let time_start_proper = dayjs(`${row[1]} ${row[2]}`, 'YYYYMMDD HH:mm');
            if (time_start_punched.isBefore(time_shift_start.add(8, 'minute'), 'minute')) {
              time_start_proper = time_shift_start;
            } else if (time_start_punched.isBetween(time_7min_start, time_7min_end, 'minute')) {
              time_start_proper = time_shift_start.add(15, 'minute');
            }

            // End Time
            if (row[3] !== '') {
              time_end_punched = dayjs(`${row[1]} ${row[3]}`, 'YYYYMMDD HH:mm');
              let time_end_proper = dayjs(`${row[1]} ${row[3]}`, 'YYYYMMDD HH:mm');
              if (time_end_punched.isAfter(time_shift_end, 'minute')) {
                time_end_proper = time_shift_end;
              }

              const dayjs_duration_punched = dayjs.duration(time_end_punched.diff(time_start_punched));
              const dayjs_duration_proper = dayjs.duration(time_end_proper.diff(time_start_proper));
              duration_total_hours_punched = dayjs_duration_punched.asHours();
              duration_total_hours_proper = dayjs_duration_proper.asHours();

              // No negative times, should never happen
              duration_total_hours_proper = duration_total_hours_proper <= 0.0 ? 0.0 : duration_total_hours_proper;

              // If worked minimum 5 hours, deduct 1/2 hour lunch
              duration_total_hours_proper =
                duration_total_hours_proper >= 5.0 ? duration_total_hours_proper - 0.5 : duration_total_hours_proper;

              // console.log(currentEmployee, row[1], duration_total_hours_proper, duration_total_hours_punched);
              // Max shift length = 8
              duration_total_hours_proper = duration_total_hours_proper >= 7.948 ? 8.0 : duration_total_hours_proper;

              // Rounding eg. 8.45, 3.95
              const value_left = Math.floor(duration_total_hours_proper); // 8    3
              let value_right = Math.round((duration_total_hours_proper % 1) * 100); // 45   95
              if (value_right >= 45 && value_right < 50) {
                duration_total_hours_proper = value_left + 0.5;
              } else if (value_right >= 95 && value_right < 100) {
                duration_total_hours_proper = value_left + 1.0;
              }
            }
          }

          employeeActualTotal += duration_total_hours_proper;
          // console.log(totaltime);
          let times: TimeSheetTimesType;
          times = {} as TimeSheetTimesType;
          times.day = col1;
          times.date = row[1];
          times.in = time_start_punched ? time_start_punched.format('HH:mm') : row[2];
          times.out = time_end_punched ? time_end_punched.format('HH:mm') : row[3];
          times.total_calc = Math.round(duration_total_hours_punched * 100) / 100;
          times.total_proper = Math.round(duration_total_hours_proper * 100) / 100;
          times.note = row[6];
          employeeRecord['times'].push(times);
        }
        if (col1 === 'Total Hours') {
          employeeRecord['total_calc'] = row[5] === '' ? 0.0 : parseFloat(row[5]);
          employeeRecord['total_proper'] = employeeActualTotal;
          timesheet.employees.push(employeeRecord);
        }
      }
    });

    // console.log('records', records);
    timesheet.employees.sort((left, right) => {
      const names_left = left.name.split(' ');
      const names_right = right.name.split(' ');
      let cmp = names_left[1].localeCompare(names_right[1]);
      if (cmp === 0) {
        cmp = names_left[0].localeCompare(names_right[0]);
      }
      return cmp;
    });

    return timesheet;
  } catch (error) {
    return undefined;
  }
};
