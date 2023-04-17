import { useState } from 'react';
import type { ActionFunction, LoaderFunction, TypedResponse } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, Outlet, useLocation, useLoaderData, useSubmit } from '@remix-run/react';
import Modal from 'react-modal';
import Layout from '~/components/Layout';
import { requireUserId } from '~/utils/session.server';
import { getTimeSheetList, deleteTimeSheet } from '~/utils/database.server';
import type { TimeSheetsListResultType } from '~/utils/database.server';
import type { TimeSheetType } from '~/types/global';
import ImportSVG from '~/svg/import';
import TimesheetSVG from '~/svg/timesheet';
import CancelSVG from '~/svg/cancel';
import CheckSVG from '~/svg/check';
import DownloadSVG from '~/svg/download';

type ActionDataType = {
  userId: string;
};

export const action: ActionFunction = async ({ request }): Promise<TypedResponse<ActionDataType>> => {
  // console.log('timesheet.tsx ACTION');
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const id = formData.get('timesheetid') || undefined;
  if (id) {
    const result = await deleteTimeSheet(id as string);
    // console.log('result', result);
    redirect('/');
  }
  return json({ userId });
};

export const loader: LoaderFunction = async ({ request }): Promise<TypedResponse<TimeSheetsListResultType>> => {
  await requireUserId(request);
  const data = await getTimeSheetList();
  return json(data);
};

export default function Index() {
  const location = useLocation();
  const loaderData = useLoaderData<TimeSheetsListResultType>();
  const submit = useSubmit();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [activeTimesheet, setActiveTimesheet] = useState({ from: '', to: '', id: '' });

  const closeModal = () => setIsOpen(false);
  const yesModal = () => {
    closeModal();
    if (activeTimesheet.id !== '') {
      const formData = new FormData();
      formData.append('timesheetid', activeTimesheet.id);
      submit(formData, { method: 'post', action: '/timesheets', encType: 'multipart/form-data' });
    }
  };

  return (
    <div className="bg-sky-100zz min-h-screen bg-gradient-to-br from-sky-100 to-sky-50 ">
      <Layout>
        <div className="flex justify-center">
          {location.pathname === '/timesheets' && (
            <div className="flex flex-col">
              <div className="font-semibold text-center text-xl">Import a NGTecoTime file:</div>
              <div className="p-2">
                <Link
                  to="/timesheets/new"
                  aria-label="Click to select a NGTecoTime report file"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded w-full mb-4 hint--top hint--bounce hint--rounded !flex justify-center items-center transition-colors"
                >
                  <ImportSVG className="w-5 h-5 fill-current mr-3" />
                  Import New Timesheet...
                </Link>
              </div>
              <div className="font-semibold text-center text-xl">Existing Timesheets:</div>
              {loaderData && loaderData.success && loaderData.timesheets && (
                <div className="flex flex-col gap-2 border border-sky-200 rounded p-4 bg-white">
                  {loaderData.timesheets.map((timesheet: TimeSheetType, index: number) => {
                    return (
                      <div key={index} className="flex">
                        <Link
                          to={`/timesheets/${timesheet.id}`}
                          aria-label="Click to edit this timesheet"
                          className="hint--top hint--bounce hint--rounded !flex justify-center items-center px-6 py-2 text-white bg-sky-500 hover:bg-sky-600 rounded transition-colors"
                        >
                          <TimesheetSVG className="w-5 h-5 fill-current mr-3" />
                          <span>{timesheet.pp_from}</span>
                          <span className="text-sky-200 mx-2"> to </span>
                          <span>{timesheet.pp_to}</span>
                        </Link>
                        <Link
                          to={`/timesheets/download/${timesheet.id}`}
                          aria-label="Click to download or print this timesheet"
                          className="hint--top hint--bounce hint--rounded !flex justify-center items-center px-6 py-2 text-white bg-purple-500 hover:bg-purple-600 rounded transition-colors ml-3"
                        >
                          <DownloadSVG className="w-5 h-5 fill-current mr-3" />
                          <span>Download/Print Timesheet...</span>
                        </Link>
                        <Form>
                          <input type="hidden" name="timesheetid" value={timesheet.id} />
                          <button
                            type="button"
                            aria-label="Click to delete this timesheet"
                            onClick={() => {
                              setActiveTimesheet({ from: timesheet.pp_from, to: timesheet.pp_to, id: timesheet.id });
                              setIsOpen(true);
                            }}
                            className="bg-red-500 text-white hover:bg-red-600 px-6 py-2 hint--top hint--bounce hint--rounded !flex justify-center items-center transition-colors ml-3 rounded"
                          >
                            <CancelSVG className="w-5 h-5 fill-current mr-2" />
                            Delete
                          </button>
                        </Form>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            // style={customStyles}
            contentLabel="Example Modal"
            className="border border-sky-700 outline-0 bg-white mb-32"
            overlayClassName="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black/75"
          >
            <div className="text-center text-lg text-white font-semibold p-2 bg-sky-700 ">Delete TimeSheet</div>

            <div className="p-6">
              <div className="mx-12">
                <div>Are you sure you want to delete this timesheet?</div>
                <div className="text-lg font-semibold">{`${activeTimesheet.from} to ${activeTimesheet.to}`}</div>
                <div>This cannot be undone. Really Delete?</div>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="flex justify-center items-center bg-red-500 hover:bg-red-600 rounded text-white px-4 py-1 mx-1"
                  onClick={closeModal}
                >
                  <CancelSVG className="w-5 h-5 fill-white mr-2" />
                  No
                </button>
                <button
                  className="flex justify-center items-center bg-emerald-500 hover:bg-emerald-600 rounded text-white px-4 py-1 mx-1"
                  onClick={yesModal}
                >
                  <CheckSVG className="w-5 h-5 fill-white mr-2" />
                  Yes
                </button>
              </div>
            </div>
          </Modal>
        </div>
        <Outlet />
      </Layout>
    </div>
  );
}
