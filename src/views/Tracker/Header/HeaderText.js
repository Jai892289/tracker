import React from 'react';

//Import Redux releated function.
import { useSelector } from 'react-redux';

//Import Material UI Components.
import Typography from '@material-ui/core/Typography';

const HeaderText = () => {

    //Reducer States.
    const strActivityName = useSelector(state => state.strActivityName);

    return (
        <div>
            <Typography variant="h6" className="header-text">
                Projects
            </Typography>
            <Typography variant="caption" className="header-sub-text">
                {strActivityName}
            </Typography>
        </div>
    )
}

export default HeaderText;