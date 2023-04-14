import { useEffect, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Modal from 'react-modal';
import TimeSheetHeader from './TimeSheetHeader';
import TimeSheetEmployee from './TimeSheetEmployee';
import type { EditTimeSheetValueFunction } from './TimeSheetEmployee';
import type { TimeSheetType, TimeSheetEmployeesType } from '~/types/global';
import { useTimeSheetStore } from '~/store/global';
import SaveSVG from '~/svg/save';
import CancelSVG from '~/svg/cancel';
import PunchInSVG from '~/svg/punchin';
import PunchOutSVG from '~/svg/punchout';
import PunchTimeSVG from '~/svg/punchtime';

dayjs.extend(duration);
dayjs.extend(customParseFormat);

const getTitleValue = (id: string) => {
  switch (id) {
    case 'pt_in':
      return 'Punch IN Time';

    case 'pt_out':
      return 'Punch Out Time';

    case 'total':
      return 'TOTAL Hours Paid';

    default:
      return '';
  }
};

const getModalImage = (id: string) => {
  switch (id) {
    case 'pt_in':
      return <PunchInSVG className="w-24 h-24" />;

    case 'pt_out':
      return <PunchOutSVG className="w-24 h-24" />;

    case 'total':
      return <PunchTimeSVG className="w-24 h-24" />;

    default:
      return '';
  }
};

Modal.setAppElement('#app');

type TimeSheetPropTypes = {
  timesheet: TimeSheetType;
};

const TimeSheet = ({ timesheet }: TimeSheetPropTypes) => {
  // console.log(timesheet);
  const setTimesheet = useTimeSheetStore((state) => state.setTimesheet);
  const [startdate, setStartdate] = useState<Dayjs | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState({
    name: '',
    date: '',
    id: '',
    original: '0.00',
    updated: '0.00',
    error: '',
  });

  const calculateTime = (pt_in: string, pt_out: string) => {
    const d_in = dayjs(`2023-04-04 ${pt_in}`, 'YYYY-MM-DD HH:mm');
    const d_out = dayjs(`2023-04-04 ${pt_out}`, 'YYYY-MM-DD HH:mm');
    const duration = dayjs.duration(d_out.diff(d_in));
    const result = duration.asHours();
    // console.log(d_in, d_out, duration, result);
    return result;
  };

  const calculateTotals = (employee: TimeSheetEmployeesType) => {
    let total1 = 0.0;
    let total2 = 0.0;

    employee.times.forEach((time) => {
      total1 += time.total_calc;
      total2 += time.total_proper;
    });

    employee.total_calc = total1;
    employee.total_proper = total2;
  };

  const updateTimesheet = () => {
    const employee = timesheet.employees.find((item) => item.name === editValue.name);
    // console.log('employee', employee);
    if (employee) {
      const time = employee.times.find((item) => item.date === editValue.date);
      // console.log('time', time, editValue);
      if (time) {
        switch (editValue.id) {
          case 'pt_in':
            time.in = editValue.updated;
            time.total_calc = calculateTime(time.in, time.out);
            break;

          case 'pt_out':
            time.out = editValue.updated;
            time.total_calc = calculateTime(time.in, time.out);
            break;

          case 'total':
            time.total_proper = parseFloat(editValue.updated);
            break;
          default:
            break;
        }
        calculateTotals(employee);
        setTimesheet(timesheet);
      }
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    // console.log(editValue);
    setIsOpen(false);
  };

  const saveModal = () => {
    if (editValue.updated === '') {
      setEditValue({ ...editValue, error: 'Invalid Entry' });
      return;
    }
    if (editValue.id === 'total') {
      if (typeof editValue.updated === 'string' && Number.isNaN(Number(editValue.updated))) {
        setEditValue({ ...editValue, error: 'Invalid Entry' });
        return;
      }
    }

    updateTimesheet();
    setIsOpen(false);
  };

  const handleDoubleClick: EditTimeSheetValueFunction = (name, date, id, original) => {
    setEditValue({
      name,
      date,
      id,
      original,
      updated: original,
      error: '',
    });
    openModal();
  };

  useEffect(() => {
    if (timesheet) setStartdate(dayjs(timesheet.pp_from, 'YYYY-MM-DD'));
  }, [timesheet]);

  useEffect(() => {
    // console.log(editValue);
  }, [editValue]);

  return (
    <div>
      <div>
        Double-Click the following values to edit: <span className="italic text-red-400">In, Out & Actual</span>.
      </div>
      {startdate && (
        <div className="text-3xl text-center border-l border-r border-sky-700 bg-sky-700 text-white py-3">
          <span className="text-sky-200">From: </span>
          <span>{startdate.format('MMMM D, YYYY')}</span>
          <span className="text-sky-200"> to </span>
          <span>{startdate.add(13, 'd').format('MMMM D, YYYY')}</span>
        </div>
      )}
      {startdate && (
        <div className="flex flex-col zzborder zzborder-sky-700">
          <TimeSheetHeader startDate={startdate} />
          {timesheet.employees?.map((employee, index) => {
            return (
              <TimeSheetEmployee
                key={index}
                employee={employee}
                odd={index % 2 === 0}
                handleDoubleClick={handleDoubleClick}
              />
            );
          })}
          <div className="border-t border-sky-700" />
        </div>
      )}
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
          <div className="text-center text-lg text-white font-semibold p-2 bg-sky-700 ">
            <span>Edit </span>
            <span className="italic">{getTitleValue(editValue.id)}</span>
          </div>

          <div className="flex p-6">
            <div>{getModalImage(editValue.id)}</div>
            <div className="mx-12">
              <div className="flex mb-2">
                <div className="w-32">Employee: </div>
                <div className="font-semibold">{editValue.name}</div>
              </div>

              <div className="flex mb-2">
                <div className="w-32">Original Value: </div>
                <div className="font-semibold">{editValue.original}</div>
              </div>
              <form className="flex items-center">
                <label htmlFor="newvalue" className="w-32">
                  Enter New Value:
                </label>
                <input
                  id="newvalue"
                  name="newvalue"
                  type={editValue.id === 'total' ? 'number' : 'time'}
                  required
                  value={editValue.updated}
                  onChange={(e) => setEditValue({ ...editValue, updated: e.target.value })}
                  className="border border-gray-400 rounded px-2 py-1"
                />
              </form>
              <div className="text-red-500 text-center w-full mb-4">{editValue.error}</div>
            </div>
            <div className="flex flex-col justify-start w-32">
              <button
                className="flex justify-center items-center bg-emerald-500 hover:bg-emerald-600 rounded text-white px-4 py-1 mb-2"
                onClick={saveModal}
              >
                <SaveSVG className="w-5 h-5 fill-white mr-2" />
                Save
              </button>
              <button
                className="flex justify-center items-center bg-red-500 hover:bg-red-600 rounded text-white px-4 py-1"
                onClick={closeModal}
              >
                <CancelSVG className="w-5 h-5 fill-white mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TimeSheet;
