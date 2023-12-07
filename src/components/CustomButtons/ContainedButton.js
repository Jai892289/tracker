import Button from '@material-ui/core/Button';

export default function ContainedButton(props) {

    const {
        type,
        color,
        className,
        size,
        disabled,
        onClick,
        children
    } = props;

    return (
        <Button
            variant="contained"
            fullWidth
            color={color}
            type={type}
            className={className}
            size={size}
            disabled={disabled}
            onClick = {onClick}
        >
            {children}
        </Button>
    );
}