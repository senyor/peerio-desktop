import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog } from 'peer-ui';
import { t } from 'peerio-translator';
import Terms from './Terms';
import Privacy from './Privacy';

interface LegalTypes {
    content: 'terms' | 'privacy';
}

@observer
export default class LegalDialog extends React.Component<LegalTypes> {
    @observable static show = false;

    static hideDialog() {
        LegalDialog.show = false;
    }

    static showDialog() {
        LegalDialog.show = true;
    }

    render() {
        const { hideDialog, show } = LegalDialog;
        const dialogActions = [{ label: t('button_ok'), onClick: hideDialog }];
        return (
            <Dialog
                active={show}
                actions={dialogActions}
                onCancel={hideDialog}
                className="terms-container"
            >
                {this.props.content === 'terms' ? <Terms /> : null}
                {this.props.content === 'privacy' ? <Privacy /> : null}
            </Dialog>
        );
    }
}
