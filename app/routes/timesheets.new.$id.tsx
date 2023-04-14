import { useEffect } from 'react';
import type { ActionFunction, TypedResponse } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useNavigate, useSubmit, useLocation } from '@remix-run/react';
import clsx from 'clsx';
import TimeSheet from '~/components/TimeSheet';
import { CustomButton } from '~/components/CustomLink/CustomLinksButtons';
import { saveTimeSheet } from '~/utils/database.server';
import type { TimeSheetResultType } from '~/utils/database.server';
import { useTimeSheetStore } from '~/store/global';
import SaveSVG from '~/svg/save';

export const action: ActionFunction = async ({ request }): Promise<TypedResponse<TimeSheetResultType>> => {
  // console.log('timesheets.new.$id ACTION');
  const formData = await request.formData();
  const timesheetRaw = formData.get('timesheet') as File;
  const timesheet = JSON.parse(await timesheetRaw.text());
  const result = await saveTimeSheet(timesheet);
  if (result.success) {
    throw redirect('/');
  }
  return json(result);
};

const TimesheetNewCreate = () => {
  const timesheet = useTimeSheetStore((state) => state.timesheet);
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<TimeSheetResultType>();
  const location = useLocation();

  const saveTimeSheetLocal = async () => {
    const formData = new FormData();
    const ts_s = JSON.stringify(timesheet, null, 0);
    const timesheetBlob = new Blob([ts_s], { type: 'application/json' });
    const timesheetFile = new File([timesheetBlob], 'myblobfile');
    // console.log('blob', await timesheetFile.text());
    formData.append('timesheet', timesheetFile, 'blobname');
    submit(formData, { method: 'post', action: location.pathname, encType: 'multipart/form-data' });
  };

  useEffect(() => {
    if (!timesheet) navigate('/');
  }, []);

  return (
    <div className="flex-col">
      <div className="flex justify-end mb-4">
        <CustomButton
          type="button"
          classes={clsx('bg-green-500 hover:bg-green-600 text-white')}
          onClick={saveTimeSheetLocal}
        >
          <SaveSVG className="w-6 h-6 fill-white mr-4" />
          Save Timesheet
          <SaveSVG className="w-6 h-6 fill-white ml-4" />
        </CustomButton>
      </div>
      {actionData && !actionData.success && <div className="text-red-500">Error saving timesheet.</div>}
      <div className="">{timesheet && <TimeSheet timesheet={timesheet} />}</div>
    </div>
  );
};

export default TimesheetNewCreate;
