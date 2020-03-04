import { combineValidators, isRequired } from 'revalidate'

export const profileAboutValidator = combineValidators({
    displayName: isRequired('Display Name'),
    bio: isRequired('Bio')
});
