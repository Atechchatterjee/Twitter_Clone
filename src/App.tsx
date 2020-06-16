import React, { FC, useState, useEffect, useRef } from "react";
import axios from "axios";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Profile from "./components/Profile";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Main from "./components/Main";
import "./App.css";

const Form: FC = () => {
  return (
    <>
      <h1>Twitter</h1>
      <Login />
      <Registration />
    </>
  );
};

interface Props {
  path: string;
  component: any;
}

const App: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean | null>(null);

  useEffect(() => {
    axios.get("/auth/isAuthenticated").then(async (user: any) => {
      console.log("User ==> ");
      console.log(user.data.isAuthenticated);
      await setIsAuthenticated(user.data.isAuthenticated);
    });
  }, [isAuthenticated]);

  function ProtectedRoute({ path, component }: Props) {
    if (isAuthenticated === null) {
      return <Redirect to={path}></Redirect>;
    }
    if (isAuthenticated === true) {
      return <Route path={path} exact component={component}></Route>;
    } else {
      return <Redirect to="/"></Redirect>;
    }
  }

  function renderProfile(props: any) {
    return (
      <>
        <h1>{props.location.pathname}</h1>
      </>
    );
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Form}></Route>
          <ProtectedRoute path="/main" component={Main}></ProtectedRoute>
          <ProtectedRoute path="/profile" component={Profile}></ProtectedRoute>
          <Route
            path="/:profile"
            render={(props: any) => renderProfile(props)}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
