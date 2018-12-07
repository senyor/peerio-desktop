// TODO: this has been dead code for a while; the file extension was changed to
// ts but the file still isn't converted to typescript. it'd probably need
// extensive fixes regardless since it's been dead for who-knows-how-long.

// import isDevEnv from '~/helpers/is-dev-env';
// import Airbrake from 'airbrake-js';
// import config from '~/config';
// import { User, socket } from 'peerio-icebear';
// import { reaction } from 'mobx';

// /**
//  * Plugs into the Airbrake API in order to send errors.
//  *
//  * @class AirbrakeTransport
//  * @extends {L.Transport}
//  *
//  */
// class AirbrakeTransport extends L.Transport {
//     constructor() {
//         super();
//         this.airbrake = new Airbrake({
//             projectId: 1,
//             projectKey: config.errorServerProjectKey,
//             host: config.errorServerUrl
//         });
//     }

//     write(msg) {
//         this.airbrake.notify({
//             error: msg,
//             environment: {
//                 platform: config.platform,
//                 arch: config.arch,
//                 clientVersion: config.appVersion,
//                 isDevBuild: isDevEnv,
//                 server: config.socketServerUrl
//             }
//         });
//     }
// }

// // configure logging
// L.level = L.LEVELS.SILLY;
// L.captureGlobalErrors();

// // no garbage in our error server in broken dev builds
// if (!isDevEnv) {
//     L.level = L.LEVELS.INFO;

//     if (config.errorServerUrl && config.errorServerUrl) {
//         const airbrakeTransport = new AirbrakeTransport();
//         L.addTransport('airbrake', airbrakeTransport, L.LEVELS.ERROR);
//         // adapt to user settings
//         socket.onceAuthenticated(() => {
//             reaction(() => User.current.settings.errorTracking, userReportsErrors => {
//                 if (userReportsErrors === false) {
//                     L.removeTransport('airbrake');
//                 } else {
//                     console.log('now reporting errors to error server');
//                     L.addTransport('airbrake', airbrakeTransport);
//                 }
//             });
//         });
//     }
// }

// if (process.type !== 'renderer') {
//     require('~/main-process/fs-logging');
// }
