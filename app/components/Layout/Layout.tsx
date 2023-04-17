import { Form } from '@remix-run/react';
import { Link } from '@remix-run/react';
import type { WithChildrenPropType } from '~/types/global';
import LogoutSVG from '~/svg/logout';
import LogoSVG from '~/svg/logo';

const Layout = ({ children }: WithChildrenPropType): JSX.Element => (
  <div id="app" className="flex justify-center flex-col">
    <Form action="/logout" method="post" className="bg-sky-500 px-6 py-3 flex w-full justify-between">
      <Link to="/" className="flex items-center text-2xl text-white font-bold">
        <LogoSVG className="w-8 h-8 mr-4" />
        <span>NGTECO TIMECARD ADMIN</span>
      </Link>
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
