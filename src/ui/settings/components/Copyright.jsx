import React from 'react';
import { observer } from 'mobx-react';

@observer
class Copyright extends React.Component {
    render() {
        return <span>&copy; 2017 Peerio Technologies, Inc. All rights reserved.</span>;
    }
}

export default Copyright;
