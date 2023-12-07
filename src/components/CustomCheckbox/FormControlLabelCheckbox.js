import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function FormControlLabelCheckbox(props) {

    const {
        name,
        color,
        checked,
        onChange,
        label
    } = props;

    return (
        <FormControlLabel
            control={
                <Checkbox
                    name={name}
                    color={color}
                    checked={checked}
                    onChange={onChange}
                />
            }
            label={label}
        />
    );
}