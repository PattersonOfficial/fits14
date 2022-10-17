export const environment = {
  production: true,
  api: 'https://secure-dev.fitnuts.com/api', // Staging
  websocket: {
    server: 'https://secure-dev.fitnuts.com',
    port: 6090,
    path: '/wss',
  },
  // old firbase credentials
  // firebase: {
  //     apiKey: 'AIzaSyAKsu0FoANTrQb5W0PhZxERkBfxlZ6rhIk',
  //     authDomain: 'fitnuts-anton.firebaseapp.com',
  //     databaseURL: 'https://fitnuts-app.firebaseio.com',
  //     projectId: 'fitnuts-anton',
  //     storageBucket: 'fitnuts-anton.appspot.com',
  //     messagingSenderId: '710255760327'
  // },
  // new firebase credentials
  firebase: {
    apiKey: 'AIzaSyBQ1zXBw0nT4WA3tCJ79dwkegzyI4WZCZM',
    authDomain: 'fitnuts-81265.firebaseapp.com',
    projectId: 'fitnuts-81265',
    storageBucket: 'fitnuts-81265.appspot.com',
    messagingSenderId: '1022852052518',
    appId: '1:1022852052518:web:86ffad62334b1ee96a58e7',
    measurementId: 'G-EPTY4L4Q11',
  },
  // bluesnapEncryptionKey:
  //   '10001$a3b3ef7ab3fa5e534de841de9bf0f1492b0ae68f2d65d1a41316b287ce27404d588a42918bd15cc22ae4215434e9821df55b52dd2baaca0f6dc2badcb245c36f8bac39ba70f7bb1e57e7b355e385910ec79e0592ac7c3d9c7a388cbd326b8865fe3c49b636a6dbe3d76ee9e76eb41f97f0e5a2e7d47ae277b073e296ef98108f36a93fd4cb91c8c2dd116c32981e106449071957bbb2ad25cbbae0cc4a104edb9487fe32dac6c6f1032031fa4eb841ee03c6039eee7dba047ccc906d2b85af4298742152b65367f1a0502c7b5690548d2656a4035d250f39a293d62a2cf27789ab84e8c442c0969e35400859501471456a0b7ae4ef8dc99835dd5aaa55d27f4d',
  bluesnapEncryptionKey: '10001$93bc7cc49edabf2a128cf2813abc72df3793efa3da473bc94e4e356b35417d2d0a9c018a18ea02f6b11757e9e103b975a25947e70b1fe196c7350736eba8223152230c5b2032d46f97576abba07ba2ca432dcff55b7cb87938658b1ccc055e52672776b5b8bbc92f600e3252a4a1095568a09097051557b6293f87b7aa4a61624d0659dc299551aedf982514cc2ea28a01212218b8f3d72ecd20f380e17fe13784a585a463ee9e0b04c55bd213e6271ec0979c443901b5614c9ff2d6bfe7fc5f16d84bc2eb35dabfbcc06abea11a49200fc8ce1f487ff2916cc228ccc2e8bfa01f5aa3239afb910c5b740d29ea4e6d7a0ba63830fce5a877f1e5970b0b3ff6a7'
};
