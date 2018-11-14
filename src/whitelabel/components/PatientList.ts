import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let PatientList = require('~/ui/chat/components/PatientList').default;
if (config.whiteLabel.name === 'medcryptor') {
    PatientList = require('~/ui/chat/components/PatientList_medcryptor').default;
}

export default PatientList;
