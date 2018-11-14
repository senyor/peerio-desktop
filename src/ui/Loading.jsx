import React from 'react';
import { when } from 'mobx';
import { observer } from 'mobx-react';
import { chatStore, chatInviteStore, crypto } from 'peerio-icebear';
import T from '~/ui/shared-components/T';
import { ProgressBar } from 'peer-ui';
import routerStore from '~/stores/router-store';
import ELEMENTS from '~/whitelabel/helpers/elements';

const messages = [
    'title_randomMessage1',
    'title_randomMessage2',
    'title_randomMessage3',
    'title_randomMessage4'
];
const randomMessage = messages[crypto.cryptoUtil.getRandomNumber(0, messages.length - 1)];

@observer
class Loading extends React.Component {
    componentDidMount() {
        this.dispose = when(
            () => chatStore.loaded,
            () => {
                // TODO: refactor when SDK is there for chat invites
                if (chatStore.chats.length || chatInviteStore.received.length) {
                    ELEMENTS.loading.goToActiveChat();
                } else {
                    routerStore.navigateTo(routerStore.ROUTES.chats);
                }
                this.dispose = null;
            }
        );
    }

    componentWillUnmount() {
        if (this.dispose) this.dispose();
    }

    render() {
        return (
            <div className="loading-screen">
                <ProgressBar type="linear" mode="indeterminate" />
                <div className="random-messages">
                    <T k={randomMessage} className="headline" tag="div" />
                </div>
            </div>
        );
    }
}

export default Loading;
