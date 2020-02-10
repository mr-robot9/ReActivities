import { combineValidators, isRequired } from 'revalidate'

export const loginValidator = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
});
