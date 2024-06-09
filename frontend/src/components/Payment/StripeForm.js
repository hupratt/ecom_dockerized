import React from "react";
import { injectStripe } from "react-stripe-elements";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "react-stripe-elements";
import Card from "react-credit-cards";

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData,
} from "./utils";
import { Button } from "semantic-ui-react";

class StripeForm extends React.Component {
  state = {
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
    formData: null,
  };

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name,
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    }

    this.setState({ [target.name]: target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { issuer } = this.state;
    const formData = [...e.target.elements]
      .filter((d) => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    this.setState({ formData });
    this.form.reset();
  };
  render() {
    const { name, number, expiry, cvc, focused, issuer } = this.state;

    return (
      <React.Fragment>
        <div key="Payment">
          <div className="App-payment">
            <Card
              number={number}
              name={name}
              expiry={expiry}
              cvc={cvc}
              focused={focused}
              callback={this.handleCallback}
            />
            <form ref={(c) => (this.form = c)}>
              <div className="form-group">
                <CardNumberElement
                  // type="tel"
                  // name="number"
                  className="form-control"
                  // placeholder="Card Number"
                  // pattern="[\d| ]{16,22}"
                  // required
                  // onChange={this.handleInputChange}
                  // onFocus={this.handleInputFocus}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div className="row">
                <div className="col-6">
                  <CardExpiryElement
                    // type="tel"
                    // name="expiry"
                    className="form-control"
                    // placeholder="Valid Thru"
                    // pattern="\d\d/\d\d"
                    // required
                    // onChange={this.handleInputChange}
                    // onFocus={this.handleInputFocus}
                  />
                </div>
                <div className="col-6">
                  <CardCvcElement
                    // type="tel"
                    // name="cvc"
                    className="form-control"
                    // placeholder="CVC"
                    // pattern="\d{3,4}"
                    // required
                    // onChange={this.handleInputChange}
                    // onFocus={this.handleInputFocus}
                  />
                </div>
              </div>
              <input type="hidden" name="issuer" value={issuer} />
              <div className="form-actions">
                <Button
                  loading={this.props.loading}
                  disabled={this.props.loading}
                  primary
                  onClick={this.props.submit}
                  style={{ marginTop: "10px" }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default injectStripe(StripeForm);
