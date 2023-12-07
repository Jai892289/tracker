//Local storage name.
const strObjUser = "objUser";
const strArrUserProjects = "arrUserProjects";
const strArrAppConfigs = "arrAppConfigs";

//Set Local Storage data.
const setLocalStorageItem = (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
};

//Get Local Storage data.
const getLocalStorageItem = (name) => {
    let value = localStorage.getItem(name);
    if (value) {
        value = JSON.parse(value);
    }
    return value;
};

//Remove Local Storage data.
const removeLocalStorageItem = (name) => {
    localStorage.removeItem(name);
};

//Set user data in local storage.
export const setUserLocalStorage = (objUser) => {
    objUser.password = btoa(objUser.password);
    delete objUser.auth_token;
    setLocalStorageItem(strObjUser, objUser);
};

//Get user data from local storage.
export const getUserDataLocalStorage = () => {
    let objUser = getLocalStorageItem(strObjUser);
    if (objUser) {
        objUser.password = atob(objUser.password);
    }
    return objUser;
};

//Clear user data from local storage.
export const clearUserDataLocalStorage = () => {
    removeLocalStorageItem(strObjUser);
};

//Update Remember-Me data in user local storage to enable/disalbe auto sign-in feature.
export const isRememberMeEnable = (rememberMe) => {
    let objUser = getLocalStorageItem(strObjUser);
    if (objUser) {
        objUser.rememberMe = rememberMe;
        setLocalStorageItem(strObjUser, objUser);
    }
};

//Set user projects data in local storage.
export const setUserProjectsLocalStorage = (arrUserProjects) => {
    setLocalStorageItem(strArrUserProjects, arrUserProjects);
};

//Get user projects data from local storage.
export const getUserProjectsLocalStorage = () => {
    let arrUserProjects = getLocalStorageItem(strArrUserProjects);
    return arrUserProjects;
};

//Set application configurations data in local storage.
export const setAppConfigsLocalStorage = (arrAppConfigs) => {
    setLocalStorageItem(strArrAppConfigs, arrAppConfigs);
};

//Get application configurations data from local storage.
export const getAppConfigsLocalStorage = () => {
    let arrAppConfigs = getLocalStorageItem(strArrAppConfigs);
    return arrAppConfigs;
};