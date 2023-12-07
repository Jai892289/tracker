import React from 'react';

//Import Material UI Components.
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

//Import Sub views.
import HeaderText from './HeaderText';

//Import Custom Components.
import OfflineStatus from '../../../components/SystemStatus/OfflineStatus';
import Timer from '../../../components/Timer/Timer';


const Header = () => {
    return (
        <div className="header-component">
            <Grid container>
                <Grid item xs={12}>
                    <div className="header">
                        <HeaderText />
                        <OfflineStatus />
                        <Timer />
                    </div>
                </Grid>
            </Grid>
            <Divider />
        </div>
    )
}

export default Header;