
export default {
  basePath: 'https://minionkevin.github.io/Game-2048',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
