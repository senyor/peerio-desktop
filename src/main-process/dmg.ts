import * as fs from 'fs';
import * as path from 'path';
import { app, dialog } from 'electron';
import TinyDb from 'peerio-icebear/dist/db/tiny-db';

// TODO: localize dialogs.

const DO_NOT_COPY_SETTING = 'doNotCopyToApplicationsFolder';

export async function handleLaunchFromDMG() {
    if (await TinyDb.system.getValue(DO_NOT_COPY_SETTING)) {
        return;
    }

    const canCopy = await canWriteToApplicationsFolder();

    await new Promise(resolve => {
        const appName = app.getName();

        if (!canCopy) {
            // User is not administrator and cannot write to Applications folder.
            // Show a different dialog, reminding not to run from DMG directly.
            //
            // XXX: in theory we shouldn't have to do it since,
            // app.moveToApplicationsFolder() will ask for administrator's
            // credentials; however due to a bug in Electron 1.8.2,
            // it doesn't work. Revisit this later.
            dialog.showMessageBox(
                {
                    type: 'info',
                    message: `${appName} is running from a disk image`,
                    detail:
                        `It is not recommended to run ${appName} directly from the disk image. ` +
                        `Please copy it to the Applications folder and run it from there.`,
                    checkboxLabel: 'Do not show this message again',
                    buttons: ['Quit', 'Launch Anyway'],
                    defaultId: 0,
                    cancelId: 1
                },
                async (response, doNotAsk) => {
                    if (doNotAsk) {
                        await TinyDb.system.setValue(DO_NOT_COPY_SETTING, true);
                    }
                    if (response !== 0) {
                        resolve();
                        return;
                    }
                    app.exit(0);
                }
            );
            return;
        }

        dialog.showMessageBox(
            {
                type: 'question',
                message: 'Copy to Applications folder?',
                detail:
                    `${appName} is running from a disk image. ` +
                    `It is recommended to copy it to the Applications folder and run it from there.`,
                checkboxLabel: 'Do not show this message again',
                buttons: ['Copy to Applications Folder', 'Do Not Copy'],
                defaultId: 0,
                cancelId: 1
            },
            async (response, doNotAsk) => {
                if (doNotAsk) {
                    await TinyDb.system.setValue(DO_NOT_COPY_SETTING, true);
                }
                if (response !== 0) {
                    resolve();
                    return;
                }
                try {
                    // Copy (not move, since we're in read-only DMG) to Applications
                    // and restart if it succeeds.
                    if (!app.moveToApplicationsFolder()) {
                        // Note: the docs are currently wrong, if non-admin user cancels
                        // authorization, an exception gets thrown rather than returning
                        // false. We don't mind.
                        console.log('User cancelled moving to Applications folder');
                    }
                } catch (ex) {
                    console.error(ex);
                    dialog.showMessageBox(
                        {
                            type: 'error',
                            message: 'Failed to copy the app into the Applications folder',
                            detail: 'Please copy it manually by dragging the app icon.',
                            buttons: ['Quit']
                        },
                        () => {
                            app.exit(0);
                        }
                    );
                }
            }
        );
    });
}

function canWriteToApplicationsFolder() {
    return new Promise(resolve => {
        fs.access('/Applications', fs.constants.W_OK, err => {
            resolve(!err);
        });
    });
}

/**
 * Returns true if the filesystem from which the current process runs is read-only
 * and has a link to Applications folder, or false if it's not.
 *
 * Applies only to macOS, always resolves to false on other OSes.
 */
export function isAppInDMG(execPath: string): boolean {
    if (process.platform !== 'darwin' || !execPath.startsWith('/Volumes')) {
        return false;
    }
    try {
        fs.accessSync(execPath, fs.constants.W_OK);
        return false;
    } catch (err) {
        if (err && err.code === 'EROFS') {
            // Read-only file system, may be a disk image.
            try {
                // Resolving from 'Peerio 2.app/Contents/MacOS/Peerio 2' to 'Applications' at the root level.
                fs.accessSync(
                    path.join(execPath, '..', '..', '..', '..', 'Applications'),
                    fs.constants.R_OK
                );
                return true; // most likely in DMG
            } catch (_) {
                return false;
            }
        }
        return false;
    }
}
