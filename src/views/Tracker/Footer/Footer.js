import React from 'react';

//Import Material UI Components.
import Divider from '@material-ui/core/Divider';

//Import Custom Components.
import SyncProcessStatus from '../../../components/SystemStatus/SyncProcessStatus';

//Import Sub Views.
import TrackerButton from './TrackerButton';

const Footer = () => {

    return (
        <div className="footer-component">
            <SyncProcessStatus />
            <Divider />
            <TrackerButton />
        </div >
    )
}

export default Footer;