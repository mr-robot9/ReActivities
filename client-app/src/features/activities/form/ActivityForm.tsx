import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivityCreateFormValues } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { isNullOrUndefined } from "util";
import { observer } from "mobx-react-lite";
import { RouteComponentProps, Link } from "react-router-dom";
import { Form as FinalForm, Field as FinalField } from "react-final-form";
import { TextInput } from "../../../app/common/form/TextInput";
import { TextAreaInput } from "../../../app/common/form/TextAreaInput";
import { SelectInput } from "../../../app/common/form/SelectInput";
import { DateInput } from "../../../app/common/form/DateInput";
import { category } from "../../../app/common/options/options";
import { combineDateAndTime } from "../../../app/common/util/util";
import { ActivityFormValues } from "../../../app/models/classes/ActivityFormValues";
import { activityValidator } from "../../../app/common/validators/activityValidator";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface IDetailParams {
  id: string;
}

/*
This component handles the edit view of a single selected Activity
OR a newly created Activity form 
*/

const ActivityForm: React.FC<RouteComponentProps<IDetailParams>> = ({
  match
}) => {
  const rootStore = useContext(RootStoreContext)
  const { activityStore } = rootStore
  const {
    createActivity,
    editActivity,
    IsSubmitting,
    loadActivity,
    IsLoading
  } = activityStore;

  //on load, set the form activity to be the one selected
  //on edit, change to the activity state which is only available in this component
  const [activity, setActivity] = useState<IActivityCreateFormValues>(
    new ActivityFormValues()
  );

  useEffect(() => {
    //only load an activity if there's an id in params
    if (match.params.id) {
      loadActivity(match.params.id).then(activityFromStore => {
        setActivity(new ActivityFormValues(activityFromStore));
      });
    }

    //cleanup during unmount
    return () => {
      console.log("cleaning up");  
      setActivity(new ActivityFormValues());
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);

    //use spread to "take out" date and time from activity
    //then reset date
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (isNullOrUndefined(activity.id)) {
      let newActivity = { ...activity, id: uuid() };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width="10">
        <Segment clearing>
          <FinalForm
            validate={activityValidator}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={IsLoading}>
                <FinalField
                  name="title"
                  placeholder="Title"
                  component={TextInput}
                />
                <FinalField
                  name="description"
                  placeholder="Description"
                  rows={3}
                  value={activity?.description ?? ""}
                  component={TextAreaInput}
                />
                <FinalField
                  name="category"
                  placeholder="Category"
                  value={activity?.category ?? ""}
                  component={SelectInput}
                  options={category}
                />
                <Form.Group widths="equal">
                  <FinalField
                    name="date"
                    placeholder="Date"
                    date={true}
                    value={activity?.date ?? ""}
                    component={DateInput}
                  />
                  <FinalField
                    name="time"
                    placeholder="Time"
                    time={true}
                    value={activity?.date ?? ""}
                    component={DateInput}
                  />
                </Form.Group>

                <FinalField
                  name="city"
                  placeholder="City"
                  value={activity?.city ?? ""}
                  component={TextInput}
                />
                <FinalField
                  name="venue"
                  placeholder="Venue"
                  value={activity?.venue ?? ""}
                  component={TextInput}
                />
                <Button
                  loading={IsSubmitting}
                  disabled={IsLoading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Save"
                />
                <Button
                  disabled={IsLoading}
                  as={Link}
                  to={
                    activity.id ? `/activities/${activity.id}` : "/activities"
                  }
                  floated="right"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
