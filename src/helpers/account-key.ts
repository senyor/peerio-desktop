import { requestDownloadPath } from '~/helpers/file';
import { saveAccountKeyBackup } from 'peerio-icebear';
import { t } from 'peerio-translator';

export async function saveAkPdf(store) {
    const { username, firstName, lastName, passphrase } = store;
    let path = '';
    try {
        path = await requestDownloadPath(
            `${username}-${t('title_appName')}.pdf`
        );
    } catch (err) {
        // user cancel
    }

    if (path) {
        saveAccountKeyBackup(
            path,
            `${firstName} ${lastName}`,
            username,
            passphrase
        );
    }
}
