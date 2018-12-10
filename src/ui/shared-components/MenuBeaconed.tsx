/**
 * This component wraps a Menu with a Beacon. This is necessary because the Menu's
 * click-to-open event is not (easily) exposed; here it's handled via `ref`. Easier
 * to handle that in this component than manage `ref` in every parent component.
 */
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Menu, MenuProps } from 'peer-ui';
import Beacon, { SpotBeaconProps } from '~/ui/shared-components/Beacon';

@observer
export default class MenuBeaconed extends React.Component<
    { menuProps: MenuProps } & { beaconProps: SpotBeaconProps }
> {
    @observable.ref menuRef = React.createRef<Menu>();

    beaconContentClick = () => {
        this.menuRef.current.handleMenuClick();

        if (this.props.beaconProps.type === 'spot' && this.props.beaconProps.onContentClick) {
            this.props.beaconProps.onContentClick();
        }
    };

    render() {
        return (
            <Beacon {...this.props.beaconProps} onContentClick={this.beaconContentClick}>
                <Menu ref={this.menuRef} {...this.props.menuProps}>
                    {this.props.children}
                </Menu>
            </Beacon>
        );
    }
}
