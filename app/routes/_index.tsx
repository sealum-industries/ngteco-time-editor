import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { requireUserId } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }): Promise<any> => {
  const userId = await requireUserId(request);
  return json({ userId });
};

export const loader: LoaderFunction = async ({ request }): Promise<any> => {
  await requireUserId(request);
  return redirect('/timesheets');
};
