import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';

export default function OutlinedTextFieldForUser(props) {

    return (
        <TextField
            variant="outlined"
            margin="normal"
            color="primary"
            type="text"
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            fullWidth
            required
            autoFocus
            InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>,
            }}
            {...props}
        />
    );
}