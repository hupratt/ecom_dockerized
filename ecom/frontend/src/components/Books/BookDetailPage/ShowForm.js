import React from "react";
import { Message } from "semantic-ui-react";
import { send } from "emailjs-com";
import { Trans } from "react-i18next";
import FormExampleFieldControlId from "./SemanticForm";
import { CSSTransition } from "react-transition-group";
import { withTranslation } from "react-i18next";
import posthog from "posthog-js";

class ShowForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message_html: "",
      email: "lapetiteportugaise.bxl@gmail.com",
      success: null,
      error: null,
      showForm: false,
      email_client: "",
      name_client: "",
    };
  }

  onChangeInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    const templateId = "template_9gmUuqgs";
    const { message_html, email_client, name_client, email } = this.state;
    const { isbn } = this.props;
    this.sendFeedback(templateId, {
      message_html,
      email_client,
      name_client,
      email,
      isbn,
    });
  };

  recordWithPosthog = () => {
    const {
      user: { user_name, email, distinct_id },
    } = this.props;
    if (process.env.POSTHOG_KEY) {
      posthog.capture("$send-email", { distinct_id });
      posthog.identify(distinct_id);
      posthog.people.set({ email, user_name });
      console.log(`Send email: ${user_name} ${email} ${distinct_id}`);
    }
  };

  showEmailForm = () => {
    this.setState({ showForm: true });
    this.recordWithPosthog();
  };

  sendFeedback = (templateId, variables) => {
    const userId = "user_mQ8MeAwQ0zwwc5ftEn2LO";
    const { t } = this.props;
    if (
      variables.message_html.length > 0 ||
      variables.email_client.length > 0
    ) {
      send("default_service", templateId, variables, userId)
        .then((res) => {
          this.setState({ success: t("Email successfully sent !") });
        })
        .catch((err) => {
          this.setState({
            error: `The email could not be sent: ${err.text}`,
          });
        });
    } else {
      this.setState({
        error: t("Missing fields"),
      });
    }
  };
  render() {
    const { success, error, showForm } = this.state;
    const { t } = this.props;
    const thanks = t("Thank you");
    const error_message = t("There was an error");
    return (
      <React.Fragment>
        {success && <Message positive header={success} content={thanks} />}
        {error && (
          <Message
            error
            header={error_message}
            content={JSON.stringify(`${error}`)}
          />
        )}

        <CSSTransition
          in={showForm == false}
          classNames="fadeout"
          unmountOnExit
          timeout={300}
        >
          <div className="email">
            <a
              href="#"
              className="primary-btn"
              onClick={() => this.showEmailForm()}
            >
              <Trans i18nKey="Email Us" />
            </a>
          </div>
        </CSSTransition>
        <CSSTransition
          in={showForm == true}
          classNames="fadein"
          appear
          timeout={300}
        >
          <FormExampleFieldControlId
            handleSubmit={this.handleSubmit}
            onChangeInput={this.onChangeInput}
          />
        </CSSTransition>
      </React.Fragment>
    );
  }
}

export default withTranslation()(ShowForm);
