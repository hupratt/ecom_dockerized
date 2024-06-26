import React from "react";
import { Dimmer, Loader, Segment, Image } from "semantic-ui-react";
import Toast from "../components/Buttons/Toast";

export const Hoc = (props) => props.children;

export const withLoading = (WrappedComponent) => {
  class HOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = { imageLoaded: false };
    }
    render() {
      if (this.props.loading) {
        return (
          <Segment style={{ border: "none", boxShadow: "unset" }}>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
            <Image style={{
  height: "100vh",
}} src='https://minio-api.thekor.eu/bookshop-images-f1492f08-f236-4a55-afb7-70ded209cb27/resources/short-paragraph.png' />
          </Segment>
        );
      }
      const { loading, ...passed } = this.props;
      return <WrappedComponent {...passed} />;
    }
  }
  return HOC;
};

export const withError = (WrappedComponent) => {
  class HOC extends React.Component {
    render() {
      const { error, errorCart, success } = this.props;
      if (error !== null) {
        return (
          <React.Fragment>
            <Toast
              error
              header="There was some errors with your submission"
              content={JSON.stringify(error)}
            />
            <WrappedComponent {...this.props} />
          </React.Fragment>
        );
      }
      if (errorCart !== null) {
        return (
          <React.Fragment>
            <Toast
              error
              header="There was some errors with your submission"
              content={JSON.stringify(errorCart)}
            />
            <WrappedComponent {...this.props} />
          </React.Fragment>
        );
      }
      if (success == true) {
        return (
          <React.Fragment>
            <Toast positive header="All good" content="Update succeeded" />
            <WrappedComponent {...this.props} />
          </React.Fragment>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  }
  return HOC;
};

export const withAuthentication = (WrappedComponent1, WrappedComponent2) => {
  class HOC extends React.Component {
    render() {
      if (this.props.authenticated || this.props.user_name) {
        return <WrappedComponent1 {...this.props} />;
      }
      const { authenticated, ...passed } = this.props;
      // pass only necessary props to the function
      return <WrappedComponent2 {...passed} />;
    }
  }
  return HOC;
};

export const withItemsInTheCart = (WrappedComponent1, WrappedComponent2) => {
  class HOC extends React.Component {
    render() {
      if (this.props.cart !== null) {
        return <WrappedComponent1 {...this.props} />;
      }
      return <WrappedComponent2 />;
    }
  }
  return HOC;
};
