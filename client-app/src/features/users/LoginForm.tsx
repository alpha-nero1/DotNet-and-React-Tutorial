import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { useStore } from '../../app/stores/store';

export default observer(function LoginForm() {
  const {userStore} = useStore();

  return (
    <Formik
      initialValues={{ email: '', password: '', error: null }}
      onSubmit={(value, { setErrors }) => userStore.login(value).catch(() => setErrors({ error: 'Invalid email or password.' }))}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
          <Header as='h2' content='Log in to reactivities' color='blue' textAlign='center' />
          <TextInput name='email' placeholder='Email'/>
          <TextInput name='password' placeholder='Password' type='password'/>
          <ErrorMessage 
            name='error' 
            render={() => (
              <Label 
                color='red' 
                content={errors.error}
                style={{marginBottom: 10}}
                basic
              />
            )}
          />
          <Button content='Login' type='submit' fluid color='blue' />
        </Form>
      )}
    </Formik>
  );
});
