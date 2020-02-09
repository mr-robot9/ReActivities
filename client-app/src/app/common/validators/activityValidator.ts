import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate'

export const activityValidator = combineValidators({
    title: isRequired({ message: 'The event title is required' }),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'), 
        hasLengthGreaterThan(4)('Description has to be at least 5 characters'))(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time'),
});



