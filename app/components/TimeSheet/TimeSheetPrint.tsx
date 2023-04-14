import React, { type LegacyRef, useEffect, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import TimeSheetHeader from './TimeSheetHeader';
import TimeSheetEmployee from './TimeSheetEmployee';
import type { TimeSheetType } from '~/types/global';

const css = `
@media all {
  .page-break {
    display: none;
  }
}

@media print {
  html, body {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
  }
}

@media print {
  #print-area {
    
  }
  .page-break {
    margin-top: 1rem;
    display: block;
    page-break-before: always;
  }
}

  @page {
    margin: 13mm;
    size: landscape;
  }

`;

type TimeSheetPrintPropTypes = {
  timesheet: TimeSheetType;
};

type TimeSheetRef = React.ForwardedRef<HTMLDivElement | undefined> | null;

const TimeSheetPrint = React.forwardRef((props: TimeSheetPrintPropTypes, ref: TimeSheetRef) => {
  const [timesheet, setTimesheet] = useState<TimeSheetType>();
  const [startdate, setStartdate] = useState<Dayjs | null>();
  const [pages, setPages] = useState(1);

  const PageHeader = () =>
    startdate ? (
      <React.Fragment>
        <div className="text-3xl text-center border-l border-r border-sky-700 bg-sky-700 text-white py-3">
          <span className="text-sky-200">From: </span>
          <span>{startdate?.format('MMMM D, YYYY')}</span>
          <span className="text-sky-200"> to </span>
          <span>{startdate?.add(13, 'd').format('MMMM D, YYYY')}</span>
        </div>
        <TimeSheetHeader startDate={startdate} />
      </React.Fragment>
    ) : (
      <React.Fragment></React.Fragment>
    );

  const PageFooter = ({ pageno }: { pageno: number }) =>
    timesheet ? (
      <div className="border-t border-sky-700 pt-2 text-xs">
        <div className="flex justify-between">
          <div>{`SEALUM TIMECARDS: ${timesheet.pp_from} to ${timesheet.pp_to}`}</div>
          <div>{`Page ${pageno} of ${pages}`}</div>
        </div>
      </div>
    ) : (
      <React.Fragment></React.Fragment>
    );

  useEffect(() => {
    if (props.timesheet) {
      setTimesheet(props.timesheet);
      setStartdate(dayjs(props.timesheet.pp_from, 'YYYY-MM-DD'));
      const quotient = Math.floor(props.timesheet.employees.length / 6);
      const remainder = props.timesheet.employees.length % 6 === 0 ? 0 : 1;
      console.log(quotient, remainder, quotient + remainder);
      setPages(quotient + remainder);
    }
  }, [props]);

  return (
    <div id="print-area" ref={ref as LegacyRef<HTMLDivElement>} className="p-0 m-0">
      {startdate && <PageHeader />}
      {startdate && timesheet && (
        <div>
          {timesheet.employees?.map((employee, index) => {
            if (index > 0 && index % 6 === 0) {
              return (
                <React.Fragment key={index}>
                  <PageFooter pageno={Math.floor((index - 1) / 6) + 1} />
                  <div className="page-break" />
                  {startdate && <PageHeader />}
                  <TimeSheetEmployee
                    key={index}
                    employee={employee}
                    odd={index % 2 === 0}
                    handleDoubleClick={() => {}}
                  />
                </React.Fragment>
              );
            }
            return (
              <TimeSheetEmployee key={index} employee={employee} odd={index % 2 === 0} handleDoubleClick={() => {}} />
            );
          })}
          <PageFooter pageno={pages} />
        </div>
      )}
      <style type="text/css">{css}</style>
    </div>
  );
});

TimeSheetPrint.displayName = 'TimeSheetPrint';

export default TimeSheetPrint;
