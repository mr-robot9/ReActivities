import React, { useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import  NavBar from "../../features/nav/NavBar";
import  ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import {observer} from "mobx-react-lite";
import { Route } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App = () => {
  const activityStore = useContext(ActivityStore)


  //second param ([]) is set empty bc we're telling react to not run this method again
  //we're using it doesn't depend on any values from props or state so no re-run
  useEffect(() => {
    console.log("getting list");
    activityStore.loadActivities();
  }, [activityStore]);

  //gets called before useEffect
  if (activityStore.IsLoading) {
    console.log("loading");
    return <LoadingComponent content = "Loading Activities"   />
  }

  console.log("returning page...");
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/activities" component={ActivityDashboard} />
        <Route exact path="/activities/:id" component={ActivityDetails} />
        <Route exact path="/createActivity" component={ActivityForm} />
      </Container>
    </Fragment>
  );
};

//observer is a higher order component (a component that takes a comp and returns another comp w/ abilities)
export default observer(App);
