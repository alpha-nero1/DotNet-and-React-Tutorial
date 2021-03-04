import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';


export default observer(function RegisterForm() {
  const {userStore} = useStore();

  const validationSchema = Yup.object({
    displayName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required()
  })

  return (
    <Formik
      initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
      onSubmit={
        (value, { setErrors }) => userStore.login(value).catch((error) => setErrors({ error }))
      }
      validationSchema={validationSchema}
    >
      {({ handleSubmit, isSubmitting, errors, dirty, isValid }) => (
        <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
          <Header as='h2' content='Sign up to reactivities' color='blue' textAlign='center' />
          <TextInput name='email' placeholder='Email'/>
          <TextInput name='displayName' placeholder='Display name'/>
          <TextInput name='username' placeholder='Username'/>
          <TextInput name='password' placeholder='Password' type='password'/>
          <ErrorMessage 
            name='error' 
            render={() => (
              <ValidationErrors errors={errors.error}/>
            )}
          />
          <Button 
            content='Register' 
            type='submit' 
            fluid 
            color='blue'
            disabled={isSubmitting || !isValid || dirty}
          />
        </Form>
      )}
    </Formik>
  );
});
