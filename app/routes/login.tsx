import { useState } from 'react';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { createUserSession, getUserId } from '~/utils/session.server';
import { verifyLogin } from '~/utils/user.server';
import clsx from 'clsx';
import Logo from '~/img/timeclock.jpg';

export const action: ActionFunction = async ({ request }): Promise<any> => {
  const formData = await request.formData();
  const name = 'timecard_admin';
  const password = formData.get('password') || '';

  // Perform form validation
  // For example, check the email is a valid email
  // Return the errors if there are any

  const user = await verifyLogin(name, password as string);

  // If no user is returned, return the error
  // console.log('user', user);

  if (!user) {
    return {
      error: true,
    };
  }

  return createUserSession({
    request,
    userId: user?.id || '',
  });
};

export const loader: LoaderFunction = async ({ request }): Promise<any> => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

type Props = {
  [x: string]: any;
};

const EyeOpenSVG = (props: Props) => (
  <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
      fill="currentColor"
    />
  </svg>
);
const EyeClosedSVG = (props: Props) => (
  <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.7649 6.07595C14.9991 6.22231 15.0703 6.53078 14.9239 6.76495C14.4849 7.46742 13.9632 8.10644 13.3702 8.66304L14.5712 9.86405C14.7664 10.0593 14.7664 10.3759 14.5712 10.5712C14.3759 10.7664 14.0593 10.7664 13.8641 10.5712L12.6011 9.30816C11.8049 9.90282 10.9089 10.3621 9.93374 10.651L10.383 12.3276C10.4544 12.5944 10.2961 12.8685 10.0294 12.94C9.76266 13.0115 9.4885 12.8532 9.41703 12.5864L8.95916 10.8775C8.48742 10.958 8.00035 10.9999 7.5 10.9999C6.99964 10.9999 6.51257 10.958 6.04082 10.8775L5.58299 12.5864C5.51153 12.8532 5.23737 13.0115 4.97063 12.94C4.7039 12.8685 4.5456 12.5944 4.61706 12.3277L5.06624 10.651C4.09111 10.3621 3.19503 9.90281 2.3989 9.30814L1.1359 10.5711C0.940638 10.7664 0.624058 10.7664 0.428797 10.5711C0.233537 10.3759 0.233537 10.0593 0.428797 9.86404L1.62982 8.66302C1.03682 8.10643 0.515113 7.46742 0.0760677 6.76495C-0.0702867 6.53078 0.000898544 6.22231 0.235064 6.07595C0.46923 5.9296 0.777703 6.00078 0.924057 6.23495C1.40354 7.00212 1.989 7.68056 2.66233 8.2427C2.67315 8.25096 2.6837 8.25971 2.69397 8.26897C4.00897 9.35527 5.65536 9.9999 7.5 9.9999C10.3078 9.9999 12.6563 8.50629 14.0759 6.23495C14.2223 6.00078 14.5308 5.9296 14.7649 6.07595Z"
      fill="currentColor"
    />
  </svg>
);

export default function LoginPage() {
  const actionData = useActionData();
  // console.log('actionData', actionData);
  const [showpw, setShowpw] = useState(false);
  return (
    <div className="flex w-screen h-screen justify-center items-center bg-gradient-to-r from-sky-500 via-sky-400  to-sky-500">
      <Form
        method="post"
        className="bg-white flex flex-col items-center p-6 rounded-lg mb-32"
        style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
      >
        <img src={Logo} alt="Logo" className="h-64" />
        <div className="relative flex flex-col my-4">
          <label htmlFor="password" className="text-sm text-gray-500">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type={showpw ? 'text' : 'password'}
            autoComplete="current-password"
            className="border rounded px-2 py-1 outline-sky-200"
          />
          <button className="absolute right-2 bottom-7 text-gray-500" type="button" onClick={() => setShowpw(!showpw)}>
            {showpw ? (
              <EyeOpenSVG className="w-5 h-5 fill-current" />
            ) : (
              <EyeClosedSVG className="w-5 h-5 fill-current" />
            )}
          </button>
          <div className={clsx('text-white text-sm', actionData?.error && '!text-red-500')}>
            Incorrect password. Try again.
          </div>
        </div>
        <button type="submit" className="bg-sky-700 hover:bg-sky-800 transition-colors px-8 py-2 text-white rounded">
          Log in
        </button>
      </Form>
    </div>
  );
}
