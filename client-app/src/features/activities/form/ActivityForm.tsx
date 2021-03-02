import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Segment, Button, Header } from 'semantic-ui-react';
import LoadingCircle from '../../../app/layout/LoadingCircle';
import { useStore } from '../../../app/stores/store';
import { Activity } from '../../../types/activity';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { v4 as uuid } from 'uuid';

export default observer(function ActivityForm() {
  const history = useHistory();
  const { activityStore } = useStore();
  const { id } = useParams<{id: string}>();
  const [at, setActivity] = useState<Activity>(new Activity());

  const validationSchema = yup.object({
    title: yup.string().required('The activity title is required.'),
    description: yup.string().required('The activity description is required.'),
    category: yup.string().required(),
    date: yup.string().required('Date is required.').nullable(),
    city: yup.string().required(),
    venue: yup.string().required()
  });

  useEffect(() => {
    if (id) {
      activityStore.loadActivity(id)
      .then((at) => {
        if (at) {
          setActivity(at!);
        }
      });
    }
  }, [id, activityStore])

  function handleFormSubmit(activity: Activity): void {
    if (activity.id.length) {
      activityStore.updateActivity(activity)
      .then(() => {
        // This is how we navighate in component!
        history.push(`/activities/${activity.id}`);
      });
    } else {
        const newActivity = new Activity(activity);
        newActivity.id = uuid();
        activityStore.createActivity(newActivity)
        .then(() => {
          // This is how we navighate in component!
          history.push(`/activities/${newActivity.id}`);
        });
    }
  }

  if (activityStore.isLoading) return <LoadingCircle content='Loading content...'/>

  return (
    <Segment clearing>
      <Header content="Activity Details" subheader color='blue'/>
      <Formik
        enableReinitialize
        initialValues={at} 
        onSubmit={(vals) => handleFormSubmit(vals)}
        validationSchema={validationSchema}
      >
        {({handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form 
            onSubmit={handleSubmit} 
            autoComplete='off'
            className='ui form'
          >
            <TextInput name='title' placeholder='Title'/>
            <TextArea
              placeholder='Description'
              name='description'
              rows={3}
            />
            <SelectInput 
              placeholder='Category'
              name='category'
              options={categoryOptions}
            />
            <DateInput 
              placeholderText='Date'
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content="Location Details" subheader color='blue'/>
            <TextInput 
              placeholder='City'
              name='city'
            />
            <TextInput 
              placeholder='Venue'
              name='venue'
            />
            <Button 
              floated='right' 
              positive 
              type='submit' 
              content='Submit'
              disabled={isSubmitting || !dirty || !isValid}
              loading={activityStore.isSubmitting}
            ></Button>
            <Button 
              floated='right'
              type='button'
              content='Cancel'
              as={Link}
              to='/activities'
            ></Button>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});