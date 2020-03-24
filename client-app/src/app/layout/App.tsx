import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    userStore,
    commonStore: { setAppLoaded, token, appLoaded }
  } = rootStore;

  useEffect(() => {
    if (token) {
      //using token, get user from API, and set user
      userStore.getSetUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [setAppLoaded, token, userStore]);

  if (!appLoaded) return <LoadingComponent content="Loading App..." />;

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />

      <Route exact path="/" component={HomePage} />

      <Route
        path={'/(.+)'}
        render={() => {
          return (
            <Fragment>
              <NavBar />
              <Container style={{ marginTop: '7em' }}>
                <Switch>
                  <PrivateRoute
                    exact
                    path="/activities"
                    component={ActivityDashboard}
                  />
                  <PrivateRoute
                    exact
                    path="/activities/:id"
                    component={ActivityDetails}
                  />
                  <PrivateRoute
                    key={location.key}
                    path={['/createActivity', '/manage/:id']}
                    component={ActivityForm}
                  />
                  <PrivateRoute
                    path="/profile/:username"
                    component={ProfilePage}
                  />
                  <Route component={NotFound} />
                </Switch>
              </Container>
            </Fragment>
          );
        }}
      />
    </Fragment>
  );
};

//observer is a higher order component (a component that takes a comp and returns another comp w/ abilities)
export default withRouter(observer(App));
