const capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const requiredValidation = (value, fieldName) => {
    let error = "";
    if (!value) {
        fieldName = capitalize(fieldName);
        error = fieldName ? fieldName : 'This field';
        error += ' is required.';
    }
    return error;
}

const emailValidation = (value) => {
    let error = "";
    error = requiredValidation(value, "Email address");
     // eslint-disable-next-line
    let emailRegEx = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    if (error === "" && !emailRegEx.test(value)) {
        error = 'Email address is invalid.';
    }
    return error;
}

export function onSubmitValidations(values) {

    let errors = {};

    //Email Validation.
    errors.email = emailValidation(values.email);

    //Password Validation.   
    errors.password = requiredValidation(values.password, "Password");

    //Removing emtry error field.
    for (let key of Object.keys(errors)) {
        if (errors[key] === "") { delete errors[key]; }
    }

    return errors;

}

export function onChangeValidations(event) {

    let error = "";

    //Email Validation.
    if (event.target.name === "email") {
        error = emailValidation(event.target.value);
    }

    //Password Validation.
    if (event.target.name === "password") {
        error = requiredValidation(event.target.value, event.target.name);
    }

    return error;

}