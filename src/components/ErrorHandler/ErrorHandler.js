import React, { useEffect } from 'react';

//Import Material UI Components.
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux'

function ErrorHandler() {

  //Reducer States.
  const dispatch = useDispatch();
  const strErrorHandlerPopup = useSelector(state => state.strErrorHandlerPopup);
  const objErrorHandler = useSelector(state => state.objErrorHandler);
  
  //Handle Modal actions.
  const handleAction = (actionType) => {
    const payload = {
      type: actionType,
      feedback: document.getElementById("feedback") ? document.getElementById("feedback").value : "",
      ...objErrorHandler
    };
    dispatch({ type: 'SEND_ERROR_REPORT_To_SERVER_REQUESTED', payload });
  };

   //Direactly send report.
   useEffect(() => {
    if (strErrorHandlerPopup === "directSendReport") {
      handleAction("sendReport");
    }
    // eslint-disable-next-line
  }, [strErrorHandlerPopup]);

  return (
    <Dialog
      open={strErrorHandlerPopup === "show"}
      aria-labelledby="error-handler-customized-dialog-title"
      className="error-handler-dialog"
    >
      <DialogTitle id="error-handler-customized-dialog-title" >
        <b>Application problem detected</b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="error-message">
          <span className="label"> Error: </span>
          <span className="message"> {objErrorHandler.strMessage}.</span>
        </DialogContentText>
        <TextField
          autoFocus
          id="feedback"
          label="Feedback"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={() => { handleAction("doNotSendReport") }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={() => { handleAction("sendReport") }}
        >
          Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorHandler;