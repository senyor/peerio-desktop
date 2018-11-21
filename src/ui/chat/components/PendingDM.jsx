import React from 'react';
import { observer } from 'mobx-react';

import routerStore from '~/stores/router-store';
import { chatStore } from 'peerio-icebear';
import T from '~/ui/shared-components/T';

import { Button } from 'peer-ui';
import PendingDMHeader from './PendingDMHeader';

@observer
class PendingDM extends React.Component {
    onDismiss() {
        routerStore.navigateTo(routerStore.ROUTES.pendingDMDismissed);
        chatStore.activeChat.dismiss();
    }

    onMessage = () => {
        chatStore.activeChat.start();
        if (this.props.onMessage) this.props.onMessage();
    };

    render() {
        if (!chatStore.activeChat) return null;
        const c = chatStore.activeChat.contact || chatStore.activeChat.otherParticipants[0];
        if (!c) return null;

        return (
            <div className="pending-dm">
                <PendingDMHeader isNewUser={chatStore.activeChat.isReceived} contact={c} />

                <div className="button-container">
                    <Button onClick={this.onDismiss}>
                        <T k="button_dismiss" />
                    </Button>
                    <Button onClick={this.onMessage} theme="affirmative">
                        <T k="button_message" />
                    </Button>
                </div>
            </div>
        );
    }
}

export default PendingDM;
