import React from "react";
import { useTranslation } from "react-i18next";

const CategoryFilter = ({ handleSetActiveCategory }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div className="ui form">
        <div className="filter-title"> {t("Category")}</div>
        <div className="book-category">
          <a href="#" onClick={handleSetActiveCategory} val="Literatura">
            {t("Literatura")}
          </a>
          <a href="#" onClick={handleSetActiveCategory} val="Arte">
            {t("Arte")}
          </a>
          <a href="#" onClick={handleSetActiveCategory} val="Gastronomia">
            {t("Gastronomia")}
          </a>
          <a href="#" onClick={handleSetActiveCategory} val="História">
            {t("História")}
          </a>
          <a href="#" onClick={handleSetActiveCategory} val="Poesia">
            {t("Poesia")}
          </a>
          <a href="#" onClick={handleSetActiveCategory} val="BD">
            {t("Banda Desenhada")}
          </a>
          <a href="#" onClick={handleSetActiveCategory} val="Turismo">
            {t("Turismo")}
          </a>
          <a href="#" onClick={handleSetActiveCategory} val="Ensino">
            {t("Ensino")}
          </a>
          <a href="#" onClick={handleSetActiveCategory} val="Juvenil">
            {t("Juvenil")}
          </a>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CategoryFilter;
