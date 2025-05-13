
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Game-2048/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/Game-2048/game-board",
    "route": "/Game-2048"
  },
  {
    "renderMode": 2,
    "route": "/Game-2048/game-board"
  },
  {
    "renderMode": 2,
    "route": "/Game-2048/game-over"
  },
  {
    "renderMode": 2,
    "route": "/Game-2048/sign-up"
  },
  {
    "renderMode": 2,
    "route": "/Game-2048/login"
  },
  {
    "renderMode": 2,
    "route": "/Game-2048/leaderboard"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 713, hash: 'a5fb1a82375fccd6a1d16faeee05f5169e1d27a7be400e025dfa27f168af26a9', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1015, hash: '26fd809cc9900abd37d942fd85b5ea52a26607c0ad8883436cffd0fa94ca0409', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'game-over/index.html': {size: 3783, hash: '642c37d8412bda00c0d65a251e26fcd03302abe55ca5e3e9c3a16706a5fcfdf5', text: () => import('./assets-chunks/game-over_index_html.mjs').then(m => m.default)},
    'sign-up/index.html': {size: 4067, hash: '63a3bb355783adf17c9ac63841ea695e7aabce1129a37c9cbcc6c2c95208ff7a', text: () => import('./assets-chunks/sign-up_index_html.mjs').then(m => m.default)},
    'leaderboard/index.html': {size: 3345, hash: '7fb06a7bb777bf654a150c541219558520e04fd5adbcfac69e319ad19d100d18', text: () => import('./assets-chunks/leaderboard_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 4155, hash: '49cab44390d04bb32f14afd37cf0c989b3c2d23bfe335d59d2fecd5848ddc9c6', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'game-board/index.html': {size: 8759, hash: '9c4eb31fecbabd303b10859b50a2a7f2dbe538701dda00506c2a645ad08f6b83', text: () => import('./assets-chunks/game-board_index_html.mjs').then(m => m.default)},
    'styles-KNGQYYPU.css': {size: 86, hash: 'ip9d7WrwHVU', text: () => import('./assets-chunks/styles-KNGQYYPU_css.mjs').then(m => m.default)}
  },
};
