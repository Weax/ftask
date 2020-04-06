import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Main from "./features/Main";
import Register from "./features/Register";
import List from "./features/List";
import Layout from "./common/Layout";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7f5fc5"
    },
    secondary: {
      main: "#ef5350"
    }
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          minHeight: '100vh'
        },
        body: {
          background: "linear-gradient(#112158, #9561a1) no-repeat"
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Router>
          <Switch>
            <Route exact path="/">
              <Main />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/list">
              <List />
            </Route>
          </Switch>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
