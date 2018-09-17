import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog } from 'peer-ui';
import { t } from 'peerio-translator';
import Terms from './Terms';
import Privacy from './Privacy';

interface LegalTypes {
    content: 'terms' | 'privacy';
    onHide?: () => void;
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

    onCancel = () => {
        LegalDialog.hideDialog();
        if (this.props.onHide) {
            this.props.onHide();
        }
    };

    render() {
        const { show } = LegalDialog;
        const dialogActions = [
            { label: t('button_ok'), onClick: this.onCancel }
        ];
        return (
            <Dialog
                active={show}
                actions={dialogActions}
                onCancel={this.onCancel}
                className="terms-container"
            >
                {this.props.content === 'terms' ? <Terms /> : null}
                {this.props.content === 'privacy' ? <Privacy /> : null}
            </Dialog>
        );
    }
}
