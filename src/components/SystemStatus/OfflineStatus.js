import React from 'react';

//Import Redux releated function.
import { useSelector } from 'react-redux';

//Import Material UI Components.
import Chip from '@material-ui/core/Chip';
import WifiOffIcon from '@material-ui/icons/WifiOff';

const OfflineStatus = () => {

    //Reducer States.
    const isSystemOnline = useSelector(state => state.isSystemOnline);

    return (
        <div className='status'>
            {!isSystemOnline &&
                <Chip
                    size="small"
                    icon={<WifiOffIcon fontSize="small" />}
                    label="OFFLINE MODE"
                />
            }
        </div>
    )
}

export default OfflineStatus