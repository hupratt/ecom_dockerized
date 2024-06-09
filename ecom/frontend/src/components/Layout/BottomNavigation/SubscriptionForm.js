import React from "react";
import { Message } from "semantic-ui-react";
import { send } from "emailjs-com";
import { Trans } from "react-i18next";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "lapetiteportugaise.bxl@gmail.com",
      success: undefined,
      error: undefined,
      from: ""
    };
  }
  handleChange = event => {
    this.setState({ from: event.target.value });
  };
  handleSubmit = event => {
    const templateId = "template_subscription";

    this.sendFeedback(templateId, {
      email: this.state.email,
      from: this.state.from
    });
  };

  sendFeedback = (templateId, variables) => {
    const userId = "user_mQ8MeAwQ0zwwc5ftEn2LO";
    if (variables.from.length > 0) {
      send("default_service", templateId, variables, userId)
        .then(res => {
          this.setState({ success: `Email successfully sent!` });
        })
        .catch(err => {
          this.setState({
            error: `The email could not be sent: ${err.text}`
          });
        });
    } else {
      this.setState({
        error: "No message"
      });
    }
  };
  render() {
    const { success, error, from } = this.state;
    const { placeholder } = this.props;
    return (
      <React.Fragment>
        {success && (
          <Message
            positive
            header={success}
            content="Thank you for your message. We will reply as soon as possible"
          />
        )}
        {error && (
          <Message
            error
            header="There was an error"
            content={JSON.stringify(`${error}. Our teams are looking into it`)}
          />
        )}
        <form className="mailing">
          <input
            type="email"
            placeholder={placeholder}
            onChange={this.handleChange}
            value={from}
          />
          <button type="button" onClick={this.handleSubmit}>
            <Trans i18nKey="Submit" />
          </button>
        </form>
      </React.Fragment>
    );
  }
}
