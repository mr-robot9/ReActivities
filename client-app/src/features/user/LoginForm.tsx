import React, { useContext } from 'react'
import { Form as FinalForm, Field as FinalField, Field } from 'react-final-form'
import { Form, Button, Label } from 'semantic-ui-react'
import { TextInput } from '../../app/common/form/TextInput'
import { RootStoreContext } from '../../app/stores/rootStore'
import { IUserFormValues } from '../../app/models/interfaces/IUser'
import { FORM_ERROR } from 'final-form'
import { loginValidator } from '../../app/common/validators/loginValidator'

export const LoginForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;

    return (
        <FinalForm
            onSubmit={(values: IUserFormValues) => userStore.login(values).catch(error => ({
                //set error so we can destructure submitError
                [FORM_ERROR]: error
            }))}
            validate={loginValidator}
            render={({ handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
                <Form onSubmit={handleSubmit}>
                    <Field name='email' component={TextInput} placeholder='Email' />
                    <Field name='password' component={TextInput} placeholder='Password' type='password' />
                    {submitError && !dirtySinceLastSubmit && <Label color='red' basic content={submitError.statusText} />}
                    <Button disabled={invalid && !dirtySinceLastSubmit || pristine} loading={submitting} positive content='Login' />
                    <br />
                    <pre>
                        {JSON.stringify(form.getState(), null, 2)}
                    </pre>
                </Form>
            )}
        />
    )
}
