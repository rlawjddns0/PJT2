export const validateEmail = email => {
    const regex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    return regex.test(email);
};

export const removeWhitespace = text => {
    const regex = /\s/g;
    return text.replace(regex,'');
};