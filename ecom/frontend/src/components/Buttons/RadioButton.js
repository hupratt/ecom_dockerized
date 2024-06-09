import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  handleChange: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};
const RadioButton = ({ handleChange, language, value, id, label }) => {
  return (
    <li>
      <label>
        <input
          id={id}
          type="radio"
          value={value}
          checked={language === value}
          onChange={handleChange}
        />
        {label}
      </label>
    </li>
  );
};

RadioButton.propTypes = propTypes;

export default RadioButton;
