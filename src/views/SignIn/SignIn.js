import React from 'react';

//Import Redux releated function.
import { useSelector } from 'react-redux';

//Import Material UI Components.
import Container from '@material-ui/core/Container';

//Import Signin Components.
import OnlineSignIn from './OnlineSignIn/OnlineSignIn';
import OfflineSignIn from './OfflineSignIn/OfflineSignIn';
import Header from './Header';
import Copyright from './Copyright';


function SignIn() {

  //Reducer States.
  const isSystemOnline = useSelector(state => state.isSystemOnline);

  return (
    <Container component="main" maxWidth="xs">
      <div className="signin-view">
        <Header />
        {isSystemOnline
          ? <OnlineSignIn />
          : <OfflineSignIn />
        }
        <Copyright />
      </div>
    </Container>
  );
}

export default SignIn;