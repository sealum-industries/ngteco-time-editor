import clsx from 'clsx';
import type { TimeSheetEmployeesType } from '~/types/global';

export type EditTimeSheetValueFunction = (name: string, date: string, id: string, original: string) => void;

type TimeSheetEmployeePropTypes = {
  employee: TimeSheetEmployeesType;
  odd: Boolean;
  handleDoubleClick: EditTimeSheetValueFunction;
};

const TimeSheetEmployee = ({ employee, odd, handleDoubleClick }: TimeSheetEmployeePropTypes): JSX.Element => {
  const formatPunchTime = (text: string) => {
    if (text === '') {
      return <span className="opacity-0 italic">0.00</span>;
    }
    return <span>{text}</span>;
  };

  const formatPunchHours = (hours: number) => {
    if (hours <= 0.0) {
      return <span className="text-gray-400 italic">0.00</span>;
    }
    return <span>{hours.toFixed(2)}</span>;
  };

  return (
    <>
      <div className={clsx('flex border-l border-r border-sky-700', !odd && 'bg-sky-100')}>
        <div className="flex items-center w-32 border-r border-gray-300 pl-2">{employee.name}</div>
        <div className="flex flex-col w-20 border-r border-sky-700">
          <div className="flex justify-end mr-1 text-red-400 text-sm pt-4">In:</div>
          <div className="flex justify-end mr-1 text-red-400 text-sm">Out:</div>
          <div className="flex justify-end mr-1 text-red-400">Punched:</div>
          <div className="flex justify-end mr-1 text-red-400 pb-4">Actual:</div>
        </div>
        {employee.times.map((time, index2) => {
          const pt_in = formatPunchTime(time.in);
          const pt_out = formatPunchTime(time.out);
          const total1 = formatPunchHours(time.total_calc);
          const total2 = formatPunchHours(time.total_proper);
          return (
            <div
              key={index2}
              className={clsx('flex flex-col w-16 border-r border-gray-300', time.day === 'SAT' && 'border-sky-700')}
            >
              <div
                className="flex justify-center text-sm pt-4 cursor-pointer hover:text-red-600"
                onDoubleClick={() => handleDoubleClick(employee.name, time.date, 'pt_in', time.in)}
              >
                {pt_in}
              </div>
              <div
                className="flex justify-center text-sm cursor-pointer hover:text-red-600"
                onDoubleClick={() => handleDoubleClick(employee.name, time.date, 'pt_out', time.out)}
              >
                {pt_out}
              </div>
              <div className="flex justify-center">{total1}</div>
              <div
                className="flex justify-center font-semibold pb-4 cursor-pointer hover:text-red-600"
                onDoubleClick={() => handleDoubleClick(employee.name, time.date, 'total', time.total_proper.toFixed(2))}
              >
                {total2}
              </div>
            </div>
          );
        })}
        <div className="flex flex-col flex-grow pl-6 ">
          <div className="flex opacity-0 text-sm pt-4">0</div>
          <div className="flex opacity-0 text-sm">0</div>
          <div className="flex">{formatPunchHours(employee.total_calc)}</div>
          <div className="flex font-semibold pb-4">{formatPunchHours(employee.total_proper)}</div>
        </div>
      </div>
    </>
  );
};

export default TimeSheetEmployee;
