import React from 'react';
import uiStore from '~/stores/ui-store';
import { MaterialIcon, Button } from 'peer-ui';
import { t } from 'peerio-icebear';
import config from '~/config';

export default function PendingFilesBanner() {
    return (
        <div className="pending-files-banner">
            <div className="banner-icon">
                <MaterialIcon icon="info" />
            </div>
            <div className="banner-note">
                {/* No sense in localizing the text below for this very temporary banner */}
                <div className="title">Files you have shared previously are now unshared.</div>
                <div className="subtitle">
                    Learn more about updated file system from our help centre.
                </div>
            </div>
            <div className="banner-buttons">
                <Button
                    label={t('button_dismiss')}
                    onClick={uiStore.hidePendingFilesBanner}
                    theme="inverted"
                />
                <Button
                    label={t('button_learnMore')}
                    href={config.translator.urlMap.pendingFiles}
                    theme="affirmative primary"
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid'
                    }}
                />
            </div>
        </div>
    );
}
