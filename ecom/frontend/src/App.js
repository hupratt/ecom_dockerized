import React, { Component, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "./actions/auth";
import "semantic-ui-css/semantic.min.css";
import CustomLayout from "./components/Layout/CustomLayout";
import "../static/styles/index.css";
import { CSSTransition } from "react-transition-group";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      // i18n translations might still be loaded by the xhr backend
      // use react's Suspense
      <Suspense fallback="loading">
        <CSSTransition in={true} appear classNames="youtube" timeout={100}>
          <div />
        </CSSTransition>
        <Router>
          <CustomLayout {...this.props} />
        </Router>
      </Suspense>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
