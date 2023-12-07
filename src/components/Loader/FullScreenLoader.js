import React from 'react';

//Import Redux releated function.
import { useSelector } from 'react-redux';

//Import Material UI Components.
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

function FullScreenLoader() {

    //Reducer States.
    const isFullScreenLoader = useSelector(state => state.isFullScreenLoader);

    return (
        <Backdrop className="fullscreen-loader" open={isFullScreenLoader} >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default FullScreenLoader;