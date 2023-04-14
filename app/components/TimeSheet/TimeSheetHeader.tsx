import type { Dayjs } from 'dayjs';
import clsx from 'clsx';

const TWO_WEEKS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

type TimeSheetHeaderPropTypes = {
  startDate: Dayjs;
};

const TimeSheetHeader = ({ startDate }: TimeSheetHeaderPropTypes): JSX.Element => {
  return (
    <div className="flex border-l border-r border-b border-sky-700 sticky top-0 bg-white">
      <div className="flex justify-center  items-center w-52 border-r border-sky-700 font-semibold text-red-600">{`${startDate.format(
        'MMM D/YY',
      )} to ${startDate.add(13, 'd').format('MMM D/YY')}`}</div>
      {TWO_WEEKS.map((day, index) => {
        return (
          <div
            key={index}
            className={clsx(
              'py-2 w-16 flex flex-col items-center font-semibold border-r',
              index % 7 === 6 ? 'border-sky-700' : 'border-gray-300',
            )}
          >
            <div className="text-center uppercase">{startDate.add(day, 'd').format('ddd')}</div>
            <div className="text-center">{startDate.add(day, 'd').format('D')}</div>
          </div>
        );
      })}
      <div className="py-2 pl-6 flex flex-grow justify-start items-center font-semibold">TOTAL</div>
    </div>
  );
};

export default TimeSheetHeader;
