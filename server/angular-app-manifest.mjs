
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://minionkevin.github.io/Game-2048/',
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
    'index.csr.html': {size: 742, hash: '776af657bf8405651e154ffd56dfd3a567113df54e4d45738921d1f8173c56af', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1044, hash: 'c0807c0dc1d13bb925f5d3729c687703da1520ef85afd0f5eb714fda3992d95b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'game-over/index.html': {size: 3812, hash: 'b183ad35e9985b37fe63765582099b8acf32fed0bc85fe3bb214a476eeba4b00', text: () => import('./assets-chunks/game-over_index_html.mjs').then(m => m.default)},
    'sign-up/index.html': {size: 4096, hash: 'e5d3767aeb6592ec2d52c67c6e0d1aa6837bb68014b5ccd845728c9ff31ad61f', text: () => import('./assets-chunks/sign-up_index_html.mjs').then(m => m.default)},
    'leaderboard/index.html': {size: 3374, hash: 'fe7b70d50543fb270ae49399efb0f3f447c4c847609198996bb08ad7986754f0', text: () => import('./assets-chunks/leaderboard_index_html.mjs').then(m => m.default)},
    'game-board/index.html': {size: 8854, hash: '04f6c329c4ecc72c1d0cc966ed683771eeb859ddc31d8eaa3bead43cd571bad2', text: () => import('./assets-chunks/game-board_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 4184, hash: 'b927619e972e6efec00a94cd40dd8d6cc21a92680ff0cf127c1483dea24cfb53', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-KNGQYYPU.css': {size: 86, hash: 'ip9d7WrwHVU', text: () => import('./assets-chunks/styles-KNGQYYPU_css.mjs').then(m => m.default)}
  },
};
