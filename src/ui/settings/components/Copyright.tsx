import React from 'react';
import { observer } from 'mobx-react';

@observer
export default class Copyright extends React.Component {
    render() {
        return <span>&copy; 2017 Peerio Technologies, Inc. All rights reserved.</span>;
    }
}
