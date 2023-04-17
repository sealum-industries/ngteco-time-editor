import { useEffect, useState, useRef } from 'react';
import type { LoaderFunction, TypedResponse } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { CSVLink } from 'react-csv';
import { useReactToPrint } from 'react-to-print';
import dayjs from 'dayjs';
import { CustomLink, CustomButton } from '~/components/CustomLink/CustomLinksButtons';
import TimeSheetPrint from '~/components/TimeSheet/TimeSheetPrint';
import { requireUserId } from '~/utils/session.server';
import { loadTimeSheet } from '~/utils/database.server';
import type { TimeSheetLoadResultType } from '~/utils/database.server';
import type { TimeSheetType } from '~/types/global';
import HomeSVG from '~/svg/home';
import DownloadSVG from '~/svg/download';
import PrintSVG from '~/svg/print';

export const loader: LoaderFunction = async ({ request, params }): Promise<TypedResponse<TimeSheetLoadResultType>> => {
  await requireUserId(request);
  const { id } = params;
  const result = await loadTimeSheet(id || '');
  return json(result);
};

const TimeSheetDownloadPrint = () => {
  const loaderData = useLoaderData<TimeSheetLoadResultType>();
  const [timesheet, setTimesheet] = useState<TimeSheetType | null>();
  const componentRef = useRef<HTMLDivElement>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current || null,
  });

  const generateCSVData = () => {
    const data: Array<Array<string>> = [];
    if (!timesheet) return data;

    const startDjs = dayjs(timesheet.pp_from, 'YYYY-MM-DD');
    let curDjs = dayjs(timesheet.pp_to, 'YYYY-MM-DD');

    data.push(['SEALUM TIMESHEET']);
    data.push([`${startDjs.format('MMM D, YYYY')} to ${curDjs.format('MMM D, YYYY')}`]);
    data.push([]);

    let h1 = ['', ''];
    let h2 = ['Employee', 'Category'];
    let h3 = [];
    let h4 = [];

    for (let index = 0; index < 14; index++) {
      curDjs = startDjs.add(index, 'day');
      h1.push(curDjs.format('ddd').toUpperCase());
      h2.push(curDjs.format('DD'));
    }
    h1.push('');
    h2.push('TOTAL');
    data.push(h1);
    data.push(h2);
    data.push([]);

    timesheet.employees.forEach((employee, index) => {
      h1 = [employee.name, 'IN Time:'];
      h2 = ['', 'OUT Time:'];
      h3 = ['', 'PUNCH Raw Time:'];
      h4 = ['', 'PROPER Time:'];

      employee.times.forEach((time, index) => {
        h1.push(time.in);
        h2.push(time.out);
        h3.push(time.total_calc);
        h4.push(time.total_proper);
      });

      h1.push('');
      h2.push('');
      h3.push(employee.total_calc.toFixed(2));
      h4.push(employee.total_proper.toFixed(2));

      data.push(h1, h2, h3, h4, []);
    });

    return data;
  };

  useEffect(() => {
    if (loaderData && loaderData.success) {
      setTimesheet(loaderData.timesheet);
      // console.log(loaderData.timesheet);
    }
  }, [loaderData]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="invisible" />
        <CustomLink classes="bg-red-500 hover:bg-red-600 text-white" to="/timesheets">
          <HomeSVG className="w-6 h-6 fill-white mr-4" />
          Cancel and Return Home
        </CustomLink>
      </div>
      <h1 className="text-2xl font-semibold mb-1">Download/Print Timesheet</h1>
      <hr className="mb-4" />
      <div className="flex justify-center mb-4">
        {timesheet && (
          <CSVLink
            data={generateCSVData()}
            aria-label="Click to download a CSV file to open with Excel"
            className="hint--top hint--bounce hint--rounded !flex justify-center items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors duration-300"
            filename={`SealumTimesheet_${timesheet.pp_from}_to_${timesheet.pp_to}.csv`}
            target="_blank"
          >
            <DownloadSVG className="w-6 h-6 fill-white mr-4" />
            <div className="flex flex-col items-center">
              <div className="font-semibold">CSV Download</div>
              <div>{`${timesheet.pp_from} to ${timesheet.pp_to}`}</div>
            </div>
            <DownloadSVG className="w-6 h-6 fill-white ml-4" />
          </CSVLink>
        )}
      </div>
      <div className="flex justify-center mb-4">
        {timesheet && (
          <div className="flex flex-col items-center">
            <CustomButton
              onClick={handlePrint}
              aria-label="Click to open the printer dialog"
              classes="hint--top hint--bounce hint--rounded !flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors duration-300"
            >
              <PrintSVG className="w-6 h-6 fill-white mr-4" />
              <div className="flex flex-col items-center">
                <div className="font-semibold">Print</div>
                <div>{`${timesheet.pp_from} to ${timesheet.pp_to}`}</div>
              </div>
              <PrintSVG className="w-6 h-6 fill-white ml-4" />
            </CustomButton>
            <div className="italic text-sm text-gray-500">Recommended printer settings:</div>
            <div className="italic text-sm text-gray-600">Orientation: Landscape, Scale: 80%</div>
          </div>
        )}
      </div>
      <div className="mt-12">
        <div>PRINT PREVIEW:</div>
        {timesheet && <TimeSheetPrint ref={componentRef} timesheet={timesheet} />}
      </div>
    </div>
  );
};

export default TimeSheetDownloadPrint;
