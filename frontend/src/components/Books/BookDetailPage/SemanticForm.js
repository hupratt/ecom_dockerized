import React from "react";
import { Form, Input, TextArea, Button, Select } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

const genderOptions = [
  { key: "m", text: "Male", value: "male" },
  { key: "f", text: "Female", value: "female" },
  { key: "o", text: "Other", value: "other" },
];

const SemanticForm = ({ handleSubmit, onChangeInput }) => {
  const { t } = useTranslation();
  return (
    <Form id="form-email">
      <Form.Group widths="equal">
        <Form.Field
          id="form-input-control-first-name"
          control={Input}
          label={t("Name")}
          placeholder={t("Name")}
          name="name_client"
          onChange={onChangeInput}
        />
        <Form.Field
          id="form-input-control-error-email"
          control={Input}
          label={t("Email")}
          placeholder="your@email.com"
          onChange={onChangeInput}
          name="email_client"
          required
        />
      </Form.Group>

      <Form.Field
        id="form-textarea-control-textarea"
        control={TextArea}
        label={t("Message")}
        placeholder={t("Would buy")}
        id="mailing"
        name="message_html"
        onChange={onChangeInput}
        required
      />
      <div className="email">
        <a className="primary-btn" href="#" onClick={handleSubmit}>
          {t("Submit")}
        </a>
      </div>
    </Form>
  );
};

export default SemanticForm;
