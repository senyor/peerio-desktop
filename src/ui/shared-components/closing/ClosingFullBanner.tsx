import React from 'react';
import { observer } from 'mobx-react';
import Banner from '../Banner';

@observer
export default class ClosingFullBanner extends React.Component<{
    onDismiss?: () => void;
    noDismiss?: boolean;
}> {
    render() {
        return (
            <Banner
                onDismiss={this.props.onDismiss}
                theme="error"
                headerText="Peerio will be closing on July 15th, 2019"
                mainText="Please download any files you wish to save before then. We apologize for any inconvenience this may cause."
                actionButton={{
                    label: 'Learn More',
                    url: 'https://support.peerio.com/hc/en-us/articles/360021688172'
                }}
            />
        );
    }
}
