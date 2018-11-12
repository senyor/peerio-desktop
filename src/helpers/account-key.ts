import { requestDownloadPath } from '~/helpers/file';
import { saveAccountKeyBackup, t } from 'peerio-icebear';
import * as telemetry from '~/telemetry';

export async function saveAkPdf(store, telemetryObj) {
    const { username, firstName, lastName, passphrase } = store;
    let path = '';
    try {
        path = await requestDownloadPath(`${username}-${t('title_appName')}.pdf`);
        telemetry.shared.confirmDownloadAk(telemetryObj);
    } catch (err) {
        // user cancel
        telemetry.shared.cancelDownloadAk(telemetryObj);
    }

    if (path) {
        saveAccountKeyBackup(path, `${firstName} ${lastName}`, username, passphrase);
    }
}
