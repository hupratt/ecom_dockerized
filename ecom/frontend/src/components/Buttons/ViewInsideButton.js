import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const propTypes = {
  isbn: PropTypes.string
};

const handleViewInside = isbn => {
  let book = document.getElementById(isbn);
  let className = book.className;
  if (className == "bk-book bk-bookdefault") {
    book.classList.remove("bk-bookdefault");
    book.classList.add("bk-viewinside");
  } else {
    book.classList.add("bk-bookdefault");
    book.classList.remove("bk-viewinside");
  }
};

const ViewInsideButton = ({ isbn }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => {
        handleViewInside(isbn);
      }}
    >
      {t("View Inside")}
    </button>
  );
};

ViewInsideButton.propTypes = propTypes;

export default ViewInsideButton;
