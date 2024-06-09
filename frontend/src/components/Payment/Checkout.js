import React, { Component } from "react";
import {
  CardElement,
  injectStripe,
  Elements,
  StripeProvider,
} from "react-stripe-elements";
import {
  Button,
  Container,
  Dimmer,
  Divider,
  Header,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Select,
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { checkoutURL } from "../../constants";
import { connect } from "react-redux";
import {
  handleFetchOrder,
  handleFetchBillingAddresses,
  handleFetchShippingAddresses,
  handleSelectChange,
} from "../../actions/checkout";
import axios from "axios";
import { resetCart } from "../../actions/cart";
import StripeForm from "./StripeForm";

const OrderPreview = ({ data }) => {
  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <Item.Group relaxed>
            {data.order_items.map((orderItem, i) => {
              return (
                <Item key={i}>
                  <Item.Image size="tiny" src={`${orderItem.livre.picture}`} />
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="a">
                      {orderItem.quantity} x {orderItem.livre.titre}
                    </Item.Header>
                    <Item.Extra>
                      <Label>{orderItem.livre.prix} €</Label>
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>

          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header>
                  Total: {data.total} €
                  {data.coupon && (
                    <Label color="green" style={{ marginLeft: "10px" }}>
                      Current coupon: {data.coupon.code} for
                      {data.coupon.amount} €
                    </Label>
                  )}
                </Item.Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

class CheckoutForm extends Component {
  componentDidMount() {
    this.props.fetchOrder(this.props.history);
    this.props.fetchBillingAddresses();
    this.props.fetchShippingAddresses();
  }
  state = {
    loading: false,
    error: null,
    success: false,
  };
  submit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    if (this.props.stripe) {
      this.props.stripe.createToken().then((result) => {
        if (result.error) {
          this.setState({ error: result.error.message, loading: false });
        } else {
          this.setState({ error: null });
          const {
            selectedBillingAddress,
            selectedShippingAddress,
          } = this.state;
          axios
            .post(checkoutURL, {
              stripeToken: result.token.id,
              selectedBillingAddress,
              selectedShippingAddress,
            })
            .then((res) => {
              this.setState({ loading: false, success: true });
            })
            .then(this.props.resetCart())
            .catch((err) => {
              this.setState({ loading: false, error: err });
            });
        }
      });
    } else {
      this.setState({ loading: false, error: "Stripe is not loaded" });
    }
  };

  render() {
    const {
      data,
      billingAddresses,
      shippingAddresses,
      selectedBillingAddress,
      selectedShippingAddress,
      handleSelectChange,
    } = this.props;
    const { error, loading, success } = this.state;
    return (
      <div>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          </Segment>
        )}
        <OrderPreview data={data} />
        <Divider />

        {shippingAddresses.length > 0 && (
          <React.Fragment>
            <Header>Shipping</Header>
            <Select
              name="selectedShippingAddress"
              value={selectedShippingAddress}
              clearable
              options={shippingAddresses}
              selection
              onChange={handleSelectChange}
            />
          </React.Fragment>
        )}

        {shippingAddresses.length == 1 && billingAddresses.length > 0 ? (
          <React.Fragment>
            <Header>Billing</Header>
            <Select
              name="selectedBillingAddress"
              value={selectedBillingAddress}
              clearable
              options={billingAddresses}
              selection
              onChange={handleSelectChange}
            />
          </React.Fragment>
        ) : (
          shippingAddresses.length == 1 && (
            <p>
              Add a billing address <Link to="/profile">here</Link>
            </p>
          )
        )}
        <Divider />
        {shippingAddresses.length < 1 ? (
          <p>
            Add at least
            <Link to="/profile"> one shipping address</Link> to complete your
            purchase
          </p>
        ) : (
          <React.Fragment>
            <Header>Payment Details</Header>

            {success && (
              <Message positive>
                <Message.Header>Your payment was successful</Message.Header>
                <p>
                  Go to your <Link to="/profile">profile</Link> to see the order
                  delivery status.
                </p>
              </Message>
            )}
            <StripeForm loading={loading} submit={this.submit} />
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectChange: (e, { name, value }) =>
      dispatch(handleSelectChange(name, value)),
    fetchOrder: (history) => dispatch(handleFetchOrder(history)),
    fetchBillingAddresses: () => dispatch(handleFetchBillingAddresses()),
    fetchShippingAddresses: () => dispatch(handleFetchShippingAddresses()),
    resetCart: () => dispatch(resetCart()),
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.checkout.data,
    shippingAddresses: state.checkout.shippingAddresses,
    billingAddresses: state.checkout.billingAddresses,
    selectedBillingAddress: state.checkout.selectedBillingAddress,
    selectedShippingAddress: state.checkout.selectedShippingAddress,
  };
};

const CheckoutFormWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutForm);

const InjectedForm = withRouter(injectStripe(CheckoutFormWithRedux));

const WrappedForm = () => (
  <Container text>
    <StripeProvider apiKey="pk_test_eRajPaamV4LUIhBv3oFmauqn">
      <div style={{ marginTop: 100, height: "100vh" }}>
        <h2>Complete your order</h2>
        <Elements>
          <InjectedForm />
        </Elements>
      </div>
    </StripeProvider>
  </Container>
);

export default WrappedForm;
