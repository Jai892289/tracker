//Import NPM Packages.
import { HashRouter, Route } from "react-router-dom";

//Import Views.
import SignIn from './views/SignIn/SignIn';
import MainView from './views/MainView/MainView';

//Routes array.
const appRoutes = [
  {
    path: "/",
    isExact: true,
    component: SignIn
  },
  {
    path: "/main-view",
    isExact: false,
    component: MainView
  }
];

const routes = (
  <HashRouter>
    <div>
      {appRoutes.map((prop, key) => {
        return (
          <Route
            path={prop.path}
            exact={prop.isExact}
            component={prop.component}
            key={key}
          />
        );
      })}
    </div>
  </HashRouter>
);

export default routes;