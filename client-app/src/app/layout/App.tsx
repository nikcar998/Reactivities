import React, { Fragment, useContext, useEffect } from "react";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import { observer } from "mobx-react-lite";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import ActivityForm from "../../features/activities/form/ActivityForm";
import { HomePage } from "../../features/home/HomePage";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import LoginForm from "../../features/user/LoginForm"
import { RootStoreContext } from "../stores/rootStore";
import { LoadingComponent } from "./LoadingComponent";
import ModalContainer from '../common/modals/ModalContainer'

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded}= rootStore.commonStore;
  const {getUser} = rootStore.userStore;

  useEffect(()=> {
    if (token){
      getUser().finally(()=> setAppLoaded())
    }else {
      setAppLoaded()
    }
  }, [getUser, setAppLoaded, token])

  if (!appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route
                  exact
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <Route
                  key={location.key}
                  exact
                  path={["/createActivity", "/menage/:id"]}
                  component={ActivityForm}
                />
                <Route path='/login' exact component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
