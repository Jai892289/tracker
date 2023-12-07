import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

//Import Material UI Components.
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux'

//Import Utils.
import { isRememberMeEnable } from '../../utils/localStorage';


function Signout() {

  //History.
  const history = useHistory();

  //Reducer States.
  const dispatch = useDispatch();
  const strUserSignoutPopup = useSelector(state => state.strUserSignoutPopup);
  const objUser = useSelector(state => state.objUser);

  //List of things that we need to do at singout time.
  const singoutProcess = () => {
    dispatch({ type: 'USER_SIGNOUT_REQUESTED' });
  }

  //check if auto signin is set not, if not then direactly signout user without popup.
  useEffect(() => {
    if (strUserSignoutPopup === "directSignout") {
      singoutProcess();
    }
    // eslint-disable-next-line
  }, [strUserSignoutPopup]);

  //After successfull singout.
  useEffect(() => {
    if (Object.keys(objUser).length === 0) {
      //Redirect user to signin view.
      history.push('/');
    }
    // eslint-disable-next-line
  }, [objUser]);

  //Handle list item click event.
  const handleListItemClick = (event, index) => {
    if (index === 1) {
      isRememberMeEnable(false);
    }
    singoutProcess();
  };

  //Handle Modal close event.
  const handleClose = () => {
    dispatch({ type: 'USER_SIGNOUT_POPUP_REQUESTED', strUserSignoutPopup: "hide" });
  };

  //Signout options.
  const signoutOptions = ["Yes", "No"];
  const signoutOptionsItems = signoutOptions.map((item, key) =>
    <ListItem
      key={`signout-list-item-${key}`}
      button
      divider={(key !== signoutOptions.length - 1) ? true : false}
      onClick={(event) => handleListItemClick(event, key)}
      className="list-Item"
    >
      <ListItemText primary={item} />
    </ListItem >
  );

  return (
    <Dialog
      open={strUserSignoutPopup === "show"}
      // onClose={handleClose}
      aria-labelledby="logut-customized-dialog-title"
      className="signout-dialog"
    >
      <DialogTitle
        id="logut-customized-dialog-title"
        onClose={handleClose}
        disableTypography
        className="title"
      >
        <Typography variant="h6" gutterBottom >
          Sign Out
        </Typography>
        <Typography variant="subtitle2" gutterBottom >
          Remember account for this device?
        </Typography>
        <IconButton
          aria-label="close"
          className="close-button"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider variant="fullWidth" />
      <List>
        {signoutOptionsItems}
      </List>
    </Dialog>
  );
}

export default Signout;