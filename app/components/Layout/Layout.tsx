import { Form } from '@remix-run/react';
import type { WithChildrenPropType } from '~/types/global';
import LogoutSVG from '~/svg/logout';

const Layout = ({ children }: WithChildrenPropType): JSX.Element => (
  <div id="app" className="flex justify-center flex-col">
    <Form action="/logout" method="post" className="bg-sky-500 p-2 flex w-full justify-between">
      <div className="text-lg text-white font-bold">TIMECARD ADMIN</div>
      <button
        type="submit"
        className="flex justify-center items-center px-3 py-1 bg-sky-600 text-white text-sm rounded"
      >
        <LogoutSVG className="w-5 h-5 fill-current mr-3" />
        Logout
      </button>
    </Form>
    <div className="w-full p-8">{children}</div>
  </div>
);

export default Layout;
