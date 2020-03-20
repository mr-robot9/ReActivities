import React, { useContext } from 'react';
import { Form as FinalForm, Field as FinalField } from 'react-final-form';
import { Form, Button, Header } from 'semantic-ui-react';
import { TextInput } from '../../app/common/form/TextInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../app/models/interfaces/IUser';
import { FORM_ERROR } from 'final-form';
import { loginValidator } from '../../app/common/validators/loginValidator';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';

export const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { userStore } = rootStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        userStore.login(values).catch(error => ({
          //set error so we can destructure submitError
          [FORM_ERROR]: error
        }))
      }
      validate={loginValidator}
      render={({
        handleSubmit,
        submitting,
        form,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Login to ReActivities"
            color="teal"
            textAlign="center"
          />
          <FinalField name="email" component={TextInput} placeholder="Email" />
          <FinalField
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text="Invalid email or password"
            />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="teal"
            content="Login"
            fluid
          />
        </Form>
      )}
    />
  );
};
