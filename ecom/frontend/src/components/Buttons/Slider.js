import React from "react";
import { Slider, Handles } from "react-compound-slider";
import { useTranslation } from "react-i18next";

const sliderStyle = {
  position: "relative",
  width: "80%",
  height: 70,
  marginLeft: 11
};

const railStyle = {
  position: "absolute",
  width: "100%",
  height: 10,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: "rgb(225, 225, 225)"
};

const domain = [0, 100];

const MySlider = ({ sliderValues, onSliderChange }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div className="filter-title">{t("Price")}</div>
      {/* Wrapper */}
      {sliderValues && (
        <Slider
          rootStyle={sliderStyle}
          domain={domain}
          step={1}
          mode={2}
          values={sliderValues}
          onChange={onSliderChange}
        >
          {/* Make rail + make it clickeable */}
          <div style={railStyle} />
          {/* Define handles */}
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
        </Slider>
      )}
    </React.Fragment>
  );
};

export default MySlider;

const Handle = ({ handle: { id, value, percent }, getHandleProps }) => {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: -15,
        marginTop: 30,
        zIndex: 1,
        width: 20,
        height: 20,
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "rgb(200, 197, 197)",
        color: "#333"
      }}
      {...getHandleProps(id)}
    >
      <div
        style={{
          marginTop: -35,
          color: "#636363"
        }}
      >
        {value}
      </div>
    </div>
  );
};
