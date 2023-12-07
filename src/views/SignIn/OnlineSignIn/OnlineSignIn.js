import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux';

//Import Custom Components.
import OutlinedTextFieldForUser from '../../../components/CustomInput/OutlinedTextFieldForUser';
import OutlinedTextFieldForPassword from '../../../components/CustomInput/OutlinedTextFieldForPassword';
import FormControlLabelCheckbox from '../../../components/CustomCheckbox/FormControlLabelCheckbox';
import ContainedButton from '../../../components/CustomButtons/ContainedButton';

//Import Signin Components.
import FormFooter from '../FormFooter';

//Import Custom Hook.
import useForm from '../../../components/HandleUserInput/useForm';

//Import Utils.
import { getUserDataLocalStorage } from '../../../utils/localStorage';


function OnlineSignIn() {

  //History.
  const history = useHistory();

  //Component States.
  const [reRender, setReRender] = useState(false);

  //Reducer States.
  const dispatch = useDispatch();
  const objUser = useSelector(state => state.objUser);
  const isFirstTimeSignin = useSelector(state => state.isFirstTimeSignin);

  //Hadle Singin event.
  const signin = (signinData) => {

    //user sign-in object.
    let tempSigninData = {
      email: signinData.email,
      password: signinData.password,
      rememberMe: signinData.rememberMe ? signinData.rememberMe : false,
      device_id: window.tracker.system.getMacAddress(),
      device_type: window.tracker.system.getSystemType()
    }

    //Dispatch user sign-in request.
    dispatch({ type: 'USER_SIGNIN_REQUESTED', formData: tempSigninData });

  }

  //Form input handle, validation and form submition.
  const { handleChange, handleSubmit, values, errors } = useForm(signin);

  //Check for Auto Singin.
  useEffect(() => {

    //Get user data from local storage.
    let tempObjUser = getUserDataLocalStorage();

    //If user has check remember me option.
    if (tempObjUser && tempObjUser.rememberMe) {

      //Prefill user data.
      values.email = tempObjUser.email;
      values.password = tempObjUser.password;
      values.rememberMe = tempObjUser.rememberMe;

      //Update state to re-render component once data is set.
      setReRender(!reRender);

      //If first time login since app start the only try to do auto login. 
      if (isFirstTimeSignin) {
        signin(tempObjUser);
      }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //After successfull login.
  useEffect(() => {
    if (Object.keys(objUser).length !== 0) {
      //Redirect user to main-view.
      history.push('/main-view');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objUser]);

  return (
    <form className="form"
      noValidate
      onSubmit={handleSubmit}
    >
      <OutlinedTextFieldForUser
        value={values.email || ''}
        onChange={handleChange}
        error={(errors.email && errors.email !== "") ? true : false}
        helperText={(errors.email || "")}
      />
      <OutlinedTextFieldForPassword
        value={values.password || ''}
        onChange={handleChange}
        error={(errors.password && errors.password !== "") ? true : false}
        helperText={(errors.password || "")}
      />
      <FormControlLabelCheckbox
        label="Remember Me"
        name="rememberMe"
        color="primary"
        checked={values.rememberMe || false}
        onChange={handleChange}
      />
      <ContainedButton
        type="submit"
        color="primary"
        className="submit"
        size="large"
      >
        Sign In
      </ContainedButton>
      <FormFooter />
    </form>
  );
}

export default OnlineSignIn;