import React from 'react';

//Import Material UI Components.
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

function FormFooter() {

  return (
    <Grid container>
      <Grid item xs>
      </Grid>
      <Grid item>
      <Link href="#" variant="body2">
          Forgot Password?
        </Link>
      </Grid>
    </Grid>
  );
}

export default FormFooter;