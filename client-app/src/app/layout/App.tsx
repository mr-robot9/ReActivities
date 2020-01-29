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
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const [editCreateMode, setEditCreateMode] = useState(false);

  const handleEditCreateToggle = () => {
      let newEditCreateMode : boolean = !editCreateMode;
      
      setEditCreateMode(newEditCreateMode);
  } 

  const handleSelectActivity = (id :string | null) => {
    if (id == null) {
      setSelectedActivity(null)
    }
    else{
      setSelectedActivity(activities.filter(a => a.id === id)[0]);
    }
  }

  const handleOpenCreateForm = () =>
  {
    setSelectedActivity(null);
    setEditCreateMode(true);
  }

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
      <NavBar handleOpenCreateForm = {handleOpenCreateForm}/>
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
          activities={activities} 
          handleSelectActivity = {handleSelectActivity} 
          selectedActivity = {selectedActivity}
          handleEditCreateToggle = {handleEditCreateToggle} 
          IsEditCreateMode = {editCreateMode}
          />
      </Container>
    </Fragment>
  );

}

export default App;
