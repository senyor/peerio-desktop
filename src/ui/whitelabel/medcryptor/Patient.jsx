// @ts-check

import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import css from 'classnames';
import { chatStore } from 'peerio-icebear';
import routerStore from '~/stores/router-store';
import PatientSidebar from './PatientSidebar';
import PatientZeroChats from './PatientZeroChats';

@observer
class Patient extends React.Component {
    @computed
    get zeroState() {
        return (
            !chatStore.loading &&
            !chatStore.activeChat &&
            routerStore.currentRoute === routerStore.ROUTES.patients
        );
    }

    render() {
        return (
            <div
                className={css('messages', 'patient-space', {
                    'patient-room': chatStore.spaces.isPatientRoomOpen
                })}
            >
                <PatientSidebar />
                {this.zeroState ? <PatientZeroChats /> : null}
                {this.props.children}
            </div>
        );
    }
}

export default Patient;
