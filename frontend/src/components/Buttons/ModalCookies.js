import React from "react";
import { Button, Modal } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

const ModalCookies = ({ handleCloseNoCookies, handleCloseYesCookies }) => {
  const { t } = useTranslation();
  return (
    <Modal open={true} basic size="small" style={{ width: "100%" }}>
      <div className="cookies-container">
        <div className="cookies">
          <h4>{t("This website uses cookies")}</h4>
          <div className="buttonwrapper">
            <Button color="red" onClick={handleCloseNoCookies} inverted>
              {t("No cookies")}
            </Button>
            <Button color="green" onClick={handleCloseYesCookies} inverted>
              <i className="fas fa-check"></i> {t("Got it")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCookies;
