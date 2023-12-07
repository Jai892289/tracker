import React, { useState } from 'react';

//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux'

//Import Material UI Components.
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

function ActivityName() {

  //Component States.
  const [activityName, setActivityName] = useState("");

  //Reducer States.
  const dispatch = useDispatch();
  const strActivityNamePopup = useSelector(state => state.strActivityNamePopup);

  //Recent activities list
  const arrRecentActivities = ['Test', 'Test imran', 'trimantra test'];

  //Handle popup save event.
  const handleSave = (event) => {
    event.preventDefault();
    let payload = { strActivityNamePopup: "hide" };
    payload.strActivityName = activityName !== "" ? activityName : undefined;
    dispatch({ type: 'ACTIVITY_NAME_POPUP', payload });
  };

  //Handle popup cancle event.
  const handleCancel = (event, reason) => {
    if (reason !== "backdropClick") {
      dispatch({ type: 'ACTIVITY_NAME_POPUP', payload: { strActivityNamePopup: "hide" } });
    }
  };

  return (
    <Dialog
      open={strActivityNamePopup === "show"}
      aria-labelledby="activity-name-popup-customized-dialog-title"
      className="activity-name-dialog"
      fullWidth
      onClose={handleCancel}
    >
      <form onSubmit={handleSave} >
        <DialogContent>
          <Autocomplete
            id="activity-name-autocomplete"
            onInputChange={(event, value) => { setActivityName(value) }}
            freeSolo
            options={arrRecentActivities}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                label="Activity Name"
                margin="normal"
                variant="outlined"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ActivityName;