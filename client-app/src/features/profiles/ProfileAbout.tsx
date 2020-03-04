import React, { useContext, useState, Fragment } from "react";
import { Tab, Grid, Header, Button, Label, List } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ProfileAboutForm } from "./ProfileAboutForm";
import { observer } from "mobx-react-lite";
import { IProfileAboutFormValues } from "../../app/models/interfaces/IProfile";
import { FORM_ERROR } from "final-form";

const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, updateProfile} = rootStore.profileStore;

  const [editProfileMode, setEditProfileMode] = useState(false);

  const updateProfileHandler = (values: IProfileAboutFormValues) => {
    return updateProfile(values).then(() => setEditProfileMode(false));
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              onClick={() => setEditProfileMode(!editProfileMode)}
              floated="right"
              basic
              content={editProfileMode ? "Cancel" : "Edit Profile"}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editProfileMode ? (
            <ProfileAboutForm profile={profile!} updateProfileHandler={updateProfileHandler} />
          ) : (
            <List>
              <List.Item>
                <List.Header>Bio</List.Header>
                {profile?.bio}
              </List.Item>
            </List>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};
export default observer(ProfileAbout);
