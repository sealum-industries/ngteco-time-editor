import { useEffect, useState } from 'react';
import type { ActionFunction, LoaderFunction, TypedResponse } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import TimeSheet from '~/components/TimeSheet';
import { CustomButton, CustomLink } from '~/components/CustomLink/CustomLinksButtons';
import { requireUserId } from '~/utils/session.server';
import { loadTimeSheet, saveTimeSheet } from '~/utils/database.server';
import type { TimeSheetResultType, TimeSheetLoadResultType } from '~/utils/database.server';
import { useTimeSheetStore } from '~/store/global';
import type { TimeSheetType } from '~/types/global';
import HomeSVG from '~/svg/home';
import SaveSVG from '~/svg/save';

export const action: ActionFunction = async ({ request }): Promise<TypedResponse<TimeSheetResultType>> => {
  // console.log('timesheets.$id ACTION');
  const formData = await request.formData();
  const timesheetRaw = formData.get('timesheet') as File;
  const timesheet = JSON.parse(await timesheetRaw.text());
  const result = await saveTimeSheet(timesheet);
  return json(result);
};

export const loader: LoaderFunction = async ({ request, params }): Promise<TypedResponse<TimeSheetLoadResultType>> => {
  await requireUserId(request);
  const { id } = params;
  const result = await loadTimeSheet(id || '');
  return json(result);
};

const TimeSheetDetails = () => {
  const loaderData = useLoaderData<TimeSheetLoadResultType>();
  const actionData = useActionData<TimeSheetResultType>();
  const submit = useSubmit();
  const setTimesheetStore = useTimeSheetStore((state) => state.setTimesheet);
  const [timesheet, setTimesheet] = useState<TimeSheetType | null>();

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
    if (loaderData && loaderData.success && loaderData.timesheet) {
      setTimesheetStore(loaderData.timesheet);
      setTimesheet(loaderData.timesheet);
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
      <h1 className="text-2xl font-semibold mb-1">View/Edit Existing Timesheet</h1>
      <hr className="mb-4" />
      <div className="flex justify-end mb-4">
        <CustomButton
          type="button"
          aria-label="Click to save this timesheet for future use"
          classes="hint--top hint--bounce hint--rounded !flex bg-green-500 hover:bg-green-600 text-white"
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

export default TimeSheetDetails;
