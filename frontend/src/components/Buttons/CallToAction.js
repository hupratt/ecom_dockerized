import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useTranslation } from "react-i18next";

const CallToAction = ({ handleSetActiveCategory }) => {
  const { t } = useTranslation();
  const [cta, setCTA] = useState(true);
  const cacheCTA = localStorage.getItem("cta") == undefined ? true : false;
  const handleClick = (_) => {
    localStorage.setItem("cta", false);
    setCTA(!cta);
  };
  return (
    <CSSTransition
      in={cta && cacheCTA}
      classNames="fadeout"
      unmountOnExit
      timeout={300}
    >
      <div className="container-wrapper">
        <div className="container container-cta">
          <h1>{t("CTA heading")}</h1>
          <h3>{t("CTA content")}</h3>
          <h3>
            <a onClick={handleSetActiveCategory} href="#" val="Ensino">
              {t("CTA link")}
            </a>
          </h3>
          <a onClick={handleClick} href="#">
            <i className="fas fa-times"></i>
          </a>
        </div>
      </div>
    </CSSTransition>
  );
};

export default CallToAction;
