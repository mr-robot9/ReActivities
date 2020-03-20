import React, { useContext, Fragment } from 'react';
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';

export const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    userStore,
    modalStore: { openModal }
  } = rootStore;

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/Assets/Images/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {userStore.isLoggedIn && userStore.user ? (
          <Fragment>
            <Header
              as="h2"
              inverted
              content={`Welcome back ${userStore.user.displayName}`}
            />
            <Button as={Link} to="/activities" size="huge" inverted>
              Go To Activities
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Header as="h2" inverted content={`Welcome to ReActivities`} />
            <Button
              onClick={() => openModal(<LoginForm />)}
              size="huge"
              inverted
            >
              Login
            </Button>
            <Button
              onClick={() => openModal(<RegisterForm />)}
              size="huge"
              inverted
            >
              Register
            </Button>
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};
