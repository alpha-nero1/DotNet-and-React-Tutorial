import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import LoadingCircle from './LoadingCircle';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

function App() {

  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getMe().finally(() => commonStore.setAppIsLoaded());
    } else {
      commonStore.setAppIsLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appIsLoaded) return <LoadingCircle content='Loading app...'/>

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage}/>
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <PrivateRoute exact path='/activities' component={ActivityDashboard}/>
                <PrivateRoute exact path='/activities/:id' component={ActivityDetails}/>
                <PrivateRoute exact key={location.key} path={['/activities/create/new', '/activities/manage/:id']} component={ActivityForm}/>
                <PrivateRoute exact path='/profiles/:username' component={ProfilePage}/>
                <PrivateRoute exact path='/errors' component={TestErrors}/>
                <Route exact path='/server-error' component={ServerError}/>
                <Route exact component={NotFound}/>
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
