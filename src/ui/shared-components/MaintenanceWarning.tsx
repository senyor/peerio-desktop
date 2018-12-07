import React from 'react';
import { observable, when, action, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

import { Dialog, MaterialIcon } from 'peer-ui';
import { serverSettings, t } from 'peerio-icebear';

import T from '~/ui/shared-components/T';

@observer
export default class MaintenanceWarning extends React.Component {
    @observable maintenanceStartDate: string | null = null;
    @observable maintenanceEndDate: string | null = null;
    @observable showDialog = false;

    reaction!: IReactionDisposer;

    componentDidMount() {
        this.reaction = when(
            () => serverSettings.maintenanceWindow && serverSettings.maintenanceWindow.length === 2,
            () => {
                this.maintenanceStartDate = moment(serverSettings.maintenanceWindow[0]).format(
                    'LLL'
                );
                this.maintenanceEndDate = moment(serverSettings.maintenanceWindow[1]).format('LLL');
            }
        );
    }

    componentWillUnmount() {
        this.reaction();
    }

    @action.bound
    toggleDialog() {
        this.showDialog = !this.showDialog;
    }

    render() {
        if (this.maintenanceStartDate && this.maintenanceEndDate) {
            return (
                <div>
                    <div className="maintenance-wrapper" onClick={this.toggleDialog}>
                        <div className="maintenance-title">{t('title_maintenance')}</div>
                        <MaterialIcon icon="info" className="maintenance-icon" />
                    </div>
                    <Dialog
                        active={this.showDialog}
                        theme="error"
                        title={t('dialog_scheduledMaintenance')}
                        onCancel={this.toggleDialog}
                        actions={[
                            {
                                label: t('button_dismiss'),
                                onClick: this.toggleDialog
                            }
                        ]}
                    >
                        <T k="dialog_scheduledMaintenanceDates" tag="p">
                            {{
                                start: this.maintenanceStartDate,
                                end: this.maintenanceEndDate
                            }}
                        </T>
                    </Dialog>
                </div>
            );
        }
        return null;
    }
}
