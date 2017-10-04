const electron = require('electron').remote;
const { socket } = require('~/icebear');

electron.powerMonitor.on('suspend', () => {
    console.log('The system is going to sleep');
    if (!socket.authenticated) return;
    socket.send('/auth/push/enable');
});

electron.powerMonitor.on('resume', () => {
    console.log('The system is going to resume');
    if (!socket.authenticated) return;
    socket.send('/auth/push/disable');
});
