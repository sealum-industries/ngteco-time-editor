/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  future: {
    v2_routeConvention: true,
    unstable_tailwind: true,
    unstable_postcss: true,
    // unstable_dev: true,  <- doesn't work with Remix App Server
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
