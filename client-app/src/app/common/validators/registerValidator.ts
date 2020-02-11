import { combineValidators, isRequired } from 'revalidate'

export const registerValidator = combineValidators({
    username: isRequired('Username'),
    displayName: isRequired('Display Name'),
    email: isRequired('Email'),
    password: isRequired('Password')
});
