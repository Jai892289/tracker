import React, { useEffect } from 'react';

//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux';

//Import Custom Components.
import Sidebar from '../../components/Sidebar/Sidebar';
import Signout from '../../components/Signout/Signout';

//Import views.
import Tracker from '../Tracker/Tracker';

function MainView() {

  //Reducer States.
  const dispatch = useDispatch();
  const isSystemOnline = useSelector(state => state.isSystemOnline);
  const isOfflineSignin = useSelector(state => state.isOfflineSignin);
  const objUser = useSelector(state => state.objUser);

  /*
  Only one time siginin when,
  User has offline signin into application
  and system connect with the internet.
  */
  useEffect(() => {
    if (isSystemOnline && isOfflineSignin) {

      //user sign-in object.
      let tempSigninData = {
        email: objUser.email,
        password: objUser.password,
        rememberMe: objUser.rememberMe,
        device_id: window.tracker.system.getMacAddress(),
        device_type: window.tracker.system.getSystemType()
      }

      //Dispatch user sign-in request.
      dispatch({ type: 'USER_SIGNIN_REQUESTED', formData: tempSigninData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSystemOnline]);

  return (
    <div className="main-view" >
      <Sidebar />
      <Signout />
      <div className="right-side-view">
        <Tracker />
      </div>
    </div>
  );
}

export default MainView;