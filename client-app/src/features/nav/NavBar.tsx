import React, { useContext } from 'react';
import { Menu, Container, Button, Dropdown, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { NavLink, Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
/*
This component handles the navbar feature
*/

const NavBar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { userStore } = rootStore;

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to="/">
          <img src="/Assets/Images/logo.png" alt="logo" />
          ReActivities
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to="/activities" />
        <Menu.Item>
          <Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Activity"
          />
        </Menu.Item>

        {userStore.user && (
          <Menu.Item position="right">
            <Image
              avatar
              spaced="right"
              src={userStore.user.image || '/Assets/Images/user.png'}
            />
            <Dropdown pointing="top left" text={userStore.user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${userStore.user.username}`}
                  text="My Profile"
                  icon="user"
                />
                <Dropdown.Item
                  onClick={userStore.logout}
                  text="Logout"
                  icon="power"
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};
export default observer(NavBar);
