import React from "react";
import { Form } from "semantic-ui-react";
import RadioButton from "../Buttons/RadioButton";
import PropTypes from "prop-types";
const propTypes = {
  language: PropTypes.string.isRequired,
  onSelectRadio: PropTypes.func.isRequired
};
import { useTranslation } from "react-i18next";

const LanguageFilter = ({ language, onSelectRadio }) => {
  const { t } = useTranslation();

  return (
    <Form className="radio">
      <div className="filter-title">{t("Language")}</div>

      <ul>
        <RadioButton
          handleChange={onSelectRadio}
          language={language}
          label={t("Portuguese")}
          value="PT"
          id="1"
        />
        <RadioButton
          handleChange={onSelectRadio}
          language={language}
          label={t("French")}
          value="FR"
          id="2"
        />
        <RadioButton
          handleChange={onSelectRadio}
          language={language}
          label={t("English")}
          value="EN"
          id="3"
        />
        <RadioButton
          handleChange={onSelectRadio}
          language={language}
          value=""
          label={t("All")}
          id="4"
        />
      </ul>
    </Form>
  );
};

LanguageFilter.propTypes = propTypes;

export default LanguageFilter;
