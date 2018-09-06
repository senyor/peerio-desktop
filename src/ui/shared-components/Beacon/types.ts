interface BeaconBaseProps {
    name: string;
}

export interface SpotBeaconProps extends BeaconBaseProps {
    type: 'spot';
    circleContent: any;
    position: 'left' | 'right';
}

export interface AreaBeaconProps extends BeaconBaseProps {
    type: 'area';
}
