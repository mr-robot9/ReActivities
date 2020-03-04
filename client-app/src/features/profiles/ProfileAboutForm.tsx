import { Form as FinalForm, Field as FinalField } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { IProfileAboutFormValues } from "../../app/models/interfaces/IProfile";
import { profileAboutValidator } from "../../app/common/validators/profileAboutValidator";
import React, { useState, useEffect } from "react";
import {Button, Form } from "semantic-ui-react";
import { TextInput } from "../../app/common/form/TextInput";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";
import { IProfile } from "../../app/models/profile";

interface IProps {
  profile: IProfile;
  updateProfileHandler: (values: IProfileAboutFormValues) => Promise<void>;
}

export const ProfileAboutForm: React.FC<IProps> = ({
  profile,
  updateProfileHandler
}) => {
  const [profileAbout, setProfileAbout] = useState<IProfileAboutFormValues>({
    bio: "",
    displayName: ""
  });

  useEffect(() => {
    //on load set profile about
    setProfileAbout({ bio: profile.bio, displayName: profile.displayName });

    //when we unmount reset profileAbout
    return () => {
      setProfileAbout({ bio: "", displayName: "" });
    };
  }, [profile.bio, profile.displayName]);

  return (
    <FinalForm
      onSubmit={(values: IProfileAboutFormValues) =>
        updateProfileHandler(values).catch(error => ({
          //set error so we can destructure submitError
          [FORM_ERROR]: error
        }))
      }
      initialValues={profileAbout}
      validate={profileAboutValidator}
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
          <FinalField
            name="displayName"
            component={TextInput}
            placeholder="Display Name"
            value={profile.displayName}
          />
          <FinalField
            name="bio"
            component={TextAreaInput}
            placeholder="Bio"
            value={profile.bio ?? ""}
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="teal"
            content="Update Profile"
            fluid
          />
        </Form>
      )}
    />
  );
};
