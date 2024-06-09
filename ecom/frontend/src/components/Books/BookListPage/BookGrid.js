import React from "react";
import { Grid, Dimmer, Loader, Segment } from "semantic-ui-react";
import { s3_base_url } from "../../../constants";
import FlipButton from "../../Buttons/FlipButton";
import ViewInsideButton from "../../Buttons/ViewInsideButton";
import PropTypes from "prop-types";
import { shortDescr } from "../../utility";
import { useTranslation } from "react-i18next";

const propTypes = {
  paginatedData: PropTypes.array.isRequired,
  handleClickOnBook: PropTypes.func.isRequired,
};

const CoolSVGResultsIsEmpty = () => {
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={`${s3_base_url}resources/noresults.png`}
          style={{ width: "50%" }}
        />
      </div>
    </React.Fragment>
  );
};

const BookGrid = ({
  paginatedData,
  handleClickOnBook,
  paginatedDataLength,
  length,
}) => {
  const { t } = useTranslation();
  const divStyle = (src) => ({
    backgroundImage: "url(" + src + ")",
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
  });
  return (
    <React.Fragment>
      <Grid divided>
        <ul id="bk-list" className="bk-list clearfix">
          {paginatedData ? (
            paginatedData.map((item) => {
              return (
                <li key={item.id}>
                  <div className="bk-book bk-bookdefault" id={item.isbn}>
                    <div className="bk-front">
                      <div className="bk-cover-back"></div>
                      <img
                        style={divStyle(`${item.picture}`)}
                        className="bk-cover"
                        onClick={() => handleClickOnBook(item.id)}
                      ></img>
                    </div>
                    <div className="bk-page">
                      <div className="bk-content bk-content-current">
                        {/* <p>{shortDescr(item.description)}</p> */}
                      </div>
                    </div>
                    <div className="bk-back">
                      {/* <p>{shortDescr(item.description)}</p> */}
                    </div>
                    <div className="bk-right"></div>

                    <div className="bk-left">
                      <h2>
                        <span>{item.auteur_nom}</span>
                        <span>{item.titre}</span>
                      </h2>
                    </div>
                  </div>

                  <div className="bk-info">
                    <h3>
                      <span>{item.auteur_nom}</span>
                      <span>{item.titre}</span>
                    </h3>
                    <span>ISBN: {item.isbn}</span>

                    <p>
                      {shortDescr(item.description)}
                      {item.description && item.description.length > 1 && (
                        <button
                          style={{ fontStyle: "italic" }}
                          onClick={() => handleClickOnBook(item.id)}
                        >
                          {t("Read More")}
                        </button>
                      )}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <CoolSVGResultsIsEmpty />
          )}
          {length - paginatedDataLength > 0 &&
            [...Array(length - paginatedDataLength || 0)]
              .slice(0, 10)
              .map((e, i) => (
                <li key={i}>
                  <div className="bk-book bk-bookdefault">
                    <div className="bk-front" id="loadmoar">
                      <div className="bk-cover-back"></div>
                      <Segment>
                        <Dimmer active inverted>
                          <Loader inverted>Loading</Loader>
                        </Dimmer>
                      </Segment>
                    </div>
                    <div className="bk-page">
                      <div className="bk-content bk-content-current"></div>
                    </div>
                    <div className="bk-back"></div>
                    <div className="bk-right"></div>

                    <div className="bk-left">
                      <h2>
                        <span>Lorem, ipsum.</span>
                        <span>Lorem, ipsum.</span>
                      </h2>
                    </div>
                  </div>

                  <div className="bk-info">
                    <h3>
                      <span>Lorem, ipsum.</span>
                      <span>Lorem, ipsum.</span>
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Officia soluta beatae nesciunt hic debitis repellat nobis
                      alias sapiente blanditiis, laboriosam natus nemo?
                      Consequatur maxime fugit tempora molestiae sunt culpa
                      omnis?
                    </p>
                  </div>
                </li>
              ))}
        </ul>
      </Grid>
    </React.Fragment>
  );
};

BookGrid.propTypes = propTypes;

export default BookGrid;
