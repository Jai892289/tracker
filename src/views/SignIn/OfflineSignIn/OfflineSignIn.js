import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

//Import Redux releated function.
import { useDispatch } from 'react-redux'

//Import Custom Components.
import OutlinedTextFieldForUser from '../../../components/CustomInput/OutlinedTextFieldForUser';
import ContainedButton from '../../../components/CustomButtons/ContainedButton';

//Import Signin Components.
import OfflineSubHeader from './OfflineSubHeader';

//Import Utils.
import { getUserDataLocalStorage, getUserProjectsLocalStorage, getAppConfigsLocalStorage } from '../../../utils/localStorage';


function OfflineSignIn() {

  //History.
  const history = useHistory();

  //Component States.
  const [emailAddress, setEmailAddress] = useState("");

  //Reducer States.
  const dispatch = useDispatch();

  //Hadle offline Singin event.
  const handleOfflineSingin = (event) => {

    if (event) event.preventDefault();

    //Get user data from local storage.
    let objUser = getUserDataLocalStorage();

    //Get user project list from local storage.
    let arrUserProjects = getUserProjectsLocalStorage();

    //Get user project list from local storage.
    let arrAppConfigs = getAppConfigsLocalStorage();

    //Dispatch offline sign-in request.
    dispatch({
      type: 'USER_OFFLINE_SIGNIN_REQUESTED',
      objUser: objUser,
      arrUserProjects: arrUserProjects,
      arrAppConfigs: arrAppConfigs
    });

    setTimeout(() => {
      dispatch({ type: 'TODAY_TIME_SUMMARY_REQUESTED' });
    }, 1000)

    //Redirect user to main-view.
    history.push('/main-view');

  }


  //Get offline user data from local storage.
  useEffect(() => {

    //Get user data from local storage.
    let objUser = getUserDataLocalStorage();

    //If user data exist in local stoage.
    if (objUser) {
      setEmailAddress(objUser.email);
    }

  }, []);

  return (
    <>
      <OfflineSubHeader
        isUserFound={emailAddress !== "" ? true : false}
      />
      <form className="form"
        noValidate
        onSubmit={handleOfflineSingin}
      >
        <OutlinedTextFieldForUser
          value={emailAddress}
          disabled
        />
        <ContainedButton
          type="submit"
          color="primary"
          className="submit"
          size="large"
          disabled={emailAddress === "" ? true : false}
        >
          Sign In
        </ContainedButton>
      </form>
    </>
  );
}

export default OfflineSignIn;