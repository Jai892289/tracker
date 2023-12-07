import { useState, useEffect } from 'react';

//Import Validation Function.
import { onSubmitValidations, onChangeValidations } from './validations';

const useForm = (callback) => {

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback(values);
        }
        // eslint-disable-next-line
    }, [errors, isSubmitting]);

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        setErrors(onSubmitValidations(values));
        setIsSubmitting(true);
    };

    const handleChange = (event) => {
        event.persist();
        switch (event.target.type) {
            case 'text':
            case 'password':
                setValues(({ ...values, [event.target.name]: event.target.value }));
                setErrors(({ ...errors, [event.target.name]: onChangeValidations(event) }));
                break;
            case 'checkbox':
                setValues(({ ...values, [event.target.name]: event.target.checked }));
                break;
            default:
                break;
        }
    }

    return {
        handleChange,
        handleSubmit,
        values,
        errors
    }
};

export default useForm;