import React from 'react';
import { observer } from 'mobx-react';
import T from '~/ui/shared-components/T';

@observer
export default class Welcome extends React.Component {
    componentWillMount() {
        console.log('mount');
    }

    render() {
        return (
            <div className="welcome">
                <T k="title_zeroFirstLoginTitleDesktop" className="title" />
                <T k="title_zeroFirstLoginMessage" className="subtitle" />
                <T k="title_learnFollowWalkthrough" className="small-print" />
            </div>
        );
    }
}
