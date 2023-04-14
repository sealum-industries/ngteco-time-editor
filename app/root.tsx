import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import globalStyles from '~/styles/global.css';
import hintStyles from 'hint.css/hint.min.css';
import { getUser } from '~/utils/session.server';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Sealum Timecards',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: hintStyles },
];

export const loader: LoaderFunction = async ({ request }): Promise<any> => {
  return json({
    user: await getUser(request),
  });
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
