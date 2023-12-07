import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AlertSnackbar(props) {

  //Props
  const {
    isOpen,
    children,
    severity,
    position,
    handleClose
  } = props;

  const anchorOrigin = {
    top: { vertical: 'top', horizontal: 'center' },
    bottom: { vertical: 'bottom', horizontal: 'center' }
  }

  return (
    <Snackbar
      open={isOpen}
      anchorOrigin={anchorOrigin[position]}
      onClose={handleClose}
      autoHideDuration={5000}
    >
      <Alert onClose={handleClose} severity={severity}>
        {children}
      </Alert>
    </Snackbar>
  );
}

export default AlertSnackbar;