import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import ChatList from './components/ChatList';

import uiStore from '~/stores/ui-store';
import ClosingFullBanner from '~/ui/shared-components/closing/ClosingFullBanner';
import ClosingOverlay from '~/ui/shared-components/closing/ClosingOverlay';

@observer
export default class Chat extends React.Component {
    @action
    dismissClosingOverlay() {
        uiStore.closingBannersVisible.appOverlay = false;
    }

    @action
    dismissClosingBanner() {
        uiStore.closingBannersVisible.chat = false;
    }

    render() {
        return (
            <>
                {uiStore.closingBannersVisible.appOverlay ? (
                    <ClosingOverlay onDismiss={this.dismissClosingOverlay} />
                ) : null}
                <div className="content-with-banner">
                    {uiStore.closingBannersVisible.chat ? (
                        <ClosingFullBanner onDismiss={this.dismissClosingBanner} />
                    ) : null}
                    <div className="messages">
                        <ChatList />
                        {this.props.children}
                    </div>
                </div>
            </>
        );
    }
}
