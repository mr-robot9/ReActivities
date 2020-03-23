import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Header, Form, Button, Comment } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Form as FinalForm, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';

const ActivityDetailedChat = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    selectedActivity,
    hubConnection
  } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(selectedActivity!.id);
    return () => {
      stopHubConnection();
    };
  }, [createHubConnection, stopHubConnection, selectedActivity]);

  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {selectedActivity &&
            selectedActivity.comments.map(c => (
              <Comment key={c.id}>
                <Comment.Avatar src={c.image || '/Assets/Images/user.png'} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${c.username}`}>
                    {c.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(c.createdAt, new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{c.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form }) => (
              <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                <Field
                  name="body"
                  component={TextAreaInput}
                  rows={2}
                  placeholder="Add your comment"
                />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  loading={submitting}
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedChat);
