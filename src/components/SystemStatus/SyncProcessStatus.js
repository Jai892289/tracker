import React, { useEffect, useState } from 'react';

//Import Redux releated function.
import { useSelector } from 'react-redux';

//Import Material UI Components.
import Typography from '@material-ui/core/Typography';

//Import Material UI Icon.
import DoneIcon from '@material-ui/icons/Done';
import SyncIcon from '@material-ui/icons/Sync';

//Import Utils.
import { timeSince } from '../../utils/functions';

const SyncProcessStatus = () => {

    //Reducer States.
    const isSingleRowDataSyncing = useSelector(state => state.isSingleRowDataSyncing);
    const isBulkRowDataSyncing = useSelector(state => state.isBulkRowDataSyncing);
    const isBulkImagesDataSyncing = useSelector(state => state.isBulkImagesDataSyncing);
    const inLastRowDataSync = useSelector(state => state.inLastRowDataSync);

    //Component States.
    const [lastRowDataSync, setLastRowDataSync] = useState(timeSince(inLastRowDataSync));

    //Set Interval of 15 second two display updated last sync time.
    useEffect(() => {
        let id = setInterval(() => {
            setLastRowDataSync(timeSince(inLastRowDataSync));
        }, 15000);
        return () => clearInterval(id);
        // eslint-disable-next-line
    }, [inLastRowDataSync]);

    return (
        <div className="process-status-component">
            {
                (isSingleRowDataSyncing || isBulkRowDataSyncing || isBulkImagesDataSyncing)
                    ?
                    <SyncIcon className={`spinner process-status-icon`} />
                    :
                    <DoneIcon className="process-status-icon" />
            }
            <Typography variant="body2" className="message">
                {
                    (isSingleRowDataSyncing || isBulkRowDataSyncing || isBulkImagesDataSyncing)
                        ?
                        "Syncing tracked time..."
                        :
                        `Tracked time synced. ${lastRowDataSync}`
                }
            </Typography>
        </div>
    )
}

export default SyncProcessStatus;