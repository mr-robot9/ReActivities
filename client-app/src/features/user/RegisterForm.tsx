import React, { useContext } from 'react';
import { Form as FinalForm, Field as FinalField } from 'react-final-form';
import { Form, Button, Header } from 'semantic-ui-react';
import { TextInput } from '../../app/common/form/TextInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../app/models/interfaces/IUser';
import { FORM_ERROR } from 'final-form';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import { registerValidator } from '../../app/common/validators/registerValidator';

export const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { userStore } = rootStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        userStore.register(values).catch(error => ({
          //set error so we can destructure submitError, for FinalForm react
          [FORM_ERROR]: error
        }))
      }
      validate={registerValidator}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Signup to ReActivities"
            color="teal"
            textAlign="center"
          />
          <FinalField
            name="username"
            component={TextInput}
            placeholder="Username"
          />
          <FinalField
            name="displayName"
            component={TextInput}
            placeholder="Display Name"
          />
          <FinalField name="email" component={TextInput} placeholder="Email" />
          <FinalField
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="teal"
            content="Register"
            fluid
          />
        </Form>
      )}
    />
  );
};
