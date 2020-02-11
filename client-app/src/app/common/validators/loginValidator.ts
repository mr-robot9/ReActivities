import { combineValidators, isRequired } from 'revalidate'

export const loginValidator = combineValidators({
    email: isRequired('Email'),
    password: isRequired('Password')
});
