import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const propTypes = {
  isbn: PropTypes.string
};
const handleFlip = isbn => {
  let book = document.getElementById(isbn);
  let className = book.className;
  if (className === "bk-book bk-viewback") {
    book.classList.add("bk-bookdefault");
    book.classList.remove("bk-viewback");
  } else {
    book.classList.remove("bk-bookdefault");
    book.classList.add("bk-viewback");
  }
};
const FlipButton = ({ isbn }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => {
        handleFlip(isbn);
      }}
    >
      {t("Flip")}
    </button>
  );
};
FlipButton.propTypes = propTypes;

export default FlipButton;
