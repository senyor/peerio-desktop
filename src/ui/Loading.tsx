import React from 'react';
import { when, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';

import { chatStore, chatInviteStore, crypto } from 'peerio-icebear';
import { ProgressBar } from 'peer-ui';

import T from '~/ui/shared-components/T';
import routerStore from '~/stores/router-store';
import ELEMENTS from '~/whitelabel/helpers/elements';

const messages: ReadonlyArray<
    | 'title_randomMessage1'
    | 'title_randomMessage2'
    | 'title_randomMessage3'
    | 'title_randomMessage4'
> = [
    'title_randomMessage1',
    'title_randomMessage2',
    'title_randomMessage3',
    'title_randomMessage4'
];
const randomMessage = messages[crypto.cryptoUtil.getRandomNumber(0, messages.length - 1)];

@observer
export default class Loading extends React.Component {
    dispose!: IReactionDisposer;

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
                <ProgressBar />
                <div className="random-messages">
                    <T k={randomMessage} className="headline" tag="div" />
                </div>
            </div>
        );
    }
}
