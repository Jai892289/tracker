//Session storage name.
const strAuthToken = "auth_token";

//Save data to sessionStorage.
const setSessionStorage = (name, value) => {
    sessionStorage.setItem(name, value);
};

//Get saved data from sessionStorage.
const getSessionStorage = (name) => {
    return sessionStorage.getItem(name);
};

//Remove saved data from sessionStorage.
const removeSessionStorage = (name) => {
    sessionStorage.removeItem(name);
};

//Set User auth token.
export const setAuthToken = (token) => {
    setSessionStorage(strAuthToken, token);
};

//Get User auth token.
export const getAuthToken = () => {
    return getSessionStorage(strAuthToken);
};

//Remove User auth token.
export const clearAuthToken = () => {
    removeSessionStorage(strAuthToken);
};