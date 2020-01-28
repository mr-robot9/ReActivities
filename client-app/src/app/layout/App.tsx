import React, { useState, useEffect, Fragment } from "react";
import logo from "./logo.svg";
import axios from "axios";
import { Header, Icon, Container } from "semantic-ui-react";
import { List } from 'semantic-ui-react';
import { IActivity } from '../models/activity'
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";



const App = () => {

  const [activities, setActivities] = useState<IActivity[]>([]);

  //second param ([]) is set empty bc we're telling react to not run this method again
  //we're using it doesn't depend on any values from props or state so no re-run
  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then(response => {
        setActivities(response.data);
      });
  }, []);

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities} />
      </Container>
    </Fragment>
  );

}

export default App;
