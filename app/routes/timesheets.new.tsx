import { useEffect, useState } from 'react';
import type { ActionFunction, LoaderFunction, TypedResponse } from '@remix-run/node';
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
  unstable_createMemoryUploadHandler,
} from '@remix-run/node';
import { Form, Outlet, useActionData, useNavigate, useLocation } from '@remix-run/react';
import { CustomButton, CustomLink } from '~/components/CustomLink/CustomLinksButtons';
import { useOptionalUser } from '~/utils/root-utils';
import { processTimeCSV, uploadTimeCSV } from '~/utils/upload.server';
import { requireUserId } from '~/utils/session.server';
import type { TimeSheetLoadResultType } from '~/utils/database.server';
import { useTimeSheetStore } from '~/store/global';
import UploadSVG from '~/svg/upload';
import HomeSVG from '~/svg/home';

type ActionDataType = TimeSheetLoadResultType & {
  userId: string;
};

export const action: ActionFunction = async ({ request }): Promise<TypedResponse<ActionDataType>> => {
  // console.log('timesheets.new ACTION');
  const userId = await requireUserId(request);

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      avoidFileConflicts: false,
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler(),
  );
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);

  const file = formData.get('timecardfile');

  const dest = await uploadTimeCSV(file);
  const timesheet = await processTimeCSV(dest);

  return json({ success: !!timesheet, timesheet, userId });
};

export const loader: LoaderFunction = async ({ request }): Promise<{}> => {
  await requireUserId(request); // Should redirect if the user is not authenticated
  return json({}); // Need to return something
};

export default function TimeSheetNew() {
  useOptionalUser();
  const actionData = useActionData<ActionDataType>();
  const navigate = useNavigate();
  const location = useLocation();
  const [setTimesheet, clearTimesheet] = useTimeSheetStore((state) => [state.setTimesheet, state.clearTimesheet]);
  const [uploadDisabled, setUploadDisabled] = useState(true);

  useEffect(() => {
    clearTimesheet();
  }, [clearTimesheet]);

  useEffect(() => {
    if (actionData && actionData.success && actionData.timesheet) {
      setTimesheet(actionData.timesheet);
      navigate(`${actionData.timesheet.id}`);
    }
  }, [actionData, navigate, setTimesheet, clearTimesheet]);

  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-between mb-4">
        <div className="invisible" />
        <CustomLink classes="bg-red-500 hover:bg-red-600 text-white" to="/timesheets">
          <HomeSVG className="w-6 h-6 fill-white mr-4" />
          Cancel and Return Home
        </CustomLink>
      </div>
      <h1 className="text-2xl font-semibold mb-1">Import New Timesheet</h1>
      <hr className="mb-4" />
      {location.pathname === '/timesheets/new' && (
        <Form method="post" encType="multipart/form-data" className="flex flex-col px-3 py-4 border rounded bg-white">
          <label htmlFor="timecardfile" className="mb-2">
            Select the <span className="text-blue-700 italic">NGTecoTime report-xxxx.csv</span> file:
          </label>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-4 w-full ">
            <input
              id="timecardfile"
              name="timecardfile"
              type="file"
              className="bg-gray-100 border flex-grow w-full md:w-auto"
              onChange={(e) => {
                setUploadDisabled(e.target.value === '');
              }}
            />
            <div className="flex justify-center">
              <CustomButton
                type="submit"
                classes="bg-emerald-500 hover:bg-emerald-600 text-white !py-1"
                disabled={uploadDisabled}
              >
                <UploadSVG className="w-5 h-5 fill-white mr-4" />
                UPLOAD FILE
                <UploadSVG className="w-5 h-5 fill-white ml-4" />
              </CustomButton>
            </div>
          </div>
        </Form>
      )}
      {actionData && !actionData.success && <div className="text-red-500">Error processing timesheet.</div>}
      <Outlet />
    </div>
  );
}
