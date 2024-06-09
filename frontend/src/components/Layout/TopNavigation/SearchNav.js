import React from "react";
import { useTranslation } from "react-i18next";

const SearchNav = ({ onSearchChange }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <div className="col-lg-7 col-md-7">
        <div className="advanced-search">
          <button type="button" className="category-btn">
            {t("All Fields")}
          </button>
          <form
            action="#"
            className="input-group"
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <input
              type="text"
              placeholder={t("What are you looking for?")}
              style={{ color: "#0f0f0f" }}
              onChange={onSearchChange}
            />
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SearchNav;
