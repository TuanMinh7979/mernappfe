
export const ValidRegister = (data) => {
    const {
        username,
        email,
        password,
        cf_password
    }
        = data;
    const errs = [];
    if (!username) {
        errs.push("Please add your username");
    } else if (username.length > 20) {
        errs.push("Max size of username is 20 character");
    }
    else if (username.length < 3) {
        errs.push("Min size of username is 3 character");
    }

    if (!email) {
        errs.push("Please add your email");
    } else if (!validateEmail(email)) {
        errs.push('Please add valid email')
    }
    const msg = checkPassword(password, cf_password);
    if (msg) errs.push(msg);
    return {
        errMsg: errs,
        errLength: errs.length,
    };
};


export const validateEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const checkPassword = (password, cf_password) => {
    if (password.length < 6) {
        return "Min size of password from 6 character";
    } else if (password.length > 20) {
        return "Max size of password is 20 character";
    } else if (password !== cf_password) {
        return "Confirm password did not match";
    }
};




//shallow equality
export const shallowEqual = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }

    return true;
};
