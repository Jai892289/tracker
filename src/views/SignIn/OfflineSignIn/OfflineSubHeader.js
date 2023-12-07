import React from 'react';

//Import Material UI Components.
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import WifiOffIcon from '@material-ui/icons/WifiOff';

function OfflineSubHeader(props) {

  const { isUserFound } = props;

  return (
    <div className="offline-sub-header">
      <Avatar className="wifi-off-icon">
        <WifiOffIcon />
      </Avatar>
      <Typography variant="h5" align="center" color="primary">
        Offile Mode
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        We can't detect an internet connection!
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        {isUserFound
          ? "You can continue to use the application in offline mode and your data will be synced once you're back online."
          : "You can't use the application in the offline mode as we can not identify you as a valid user, please try again once you're back online."
        }
      </Typography>
    </div>
  );
}

export default OfflineSubHeader;