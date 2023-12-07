import React from 'react';

//Import Material UI Components.
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function Copyright() {
    return (
        <Box className="copy-right">
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                {new Date().getFullYear()}
                {' doyenhub. All rights reserved.'}
            </Typography>
        </Box>
    );
}

export default Copyright;