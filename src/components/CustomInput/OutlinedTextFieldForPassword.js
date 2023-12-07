import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default function OutlinedTextFieldForPassword(props) {

    const [isVisibility, setVisibility] = useState(false);

    const handleClickShowPassword = () => {
        setVisibility(isVisibility ? false : true);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            name="password"
            type={isVisibility ? "text" : "password"}
            autoComplete="current-password"
            required
            InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {isVisibility ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            {...props}
        />
    );
}