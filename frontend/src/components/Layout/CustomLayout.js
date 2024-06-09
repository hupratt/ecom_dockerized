import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { withAuthentication, withError } from "../../hoc/hoc";
import TopNavigationNoAuth from "./TopNavigation/TopNavigationNoAuth";
import TopNavigationWithAuth from "./TopNavigation/TopNavigationWithAuth";
import BottomNavigation from "../Layout/BottomNavigation/BottomNavigation";
// debounce so that each state change of the search query does not DDOS our backend
import { debounce } from "throttle-debounce";
import { searchThis } from "../../actions/navigation";
import BaseRouter from "../../routes";
import { bookListURL } from "../../constants";
import { fetchBooks, loadmoar } from "../../actions/books";
import { fetchCart } from "../../actions/cart";
import { userIsStaff, grabCookies } from "../../actions/auth";
import queryString from "query-string";
import ModalCookies from "../Buttons/ModalCookies";
import posthog from "posthog-js";
import get_cookies_array from "../../components/utility";

class CustomLayout extends React.Component {
  state = {
    language: "",
    authors: new Map(),
    category: "",
    sliderValues: [0, 100],
    search: "",
    modalOpen: false,
  };
  constructor(props) {
    super(props);
    this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch);
  }
  onSearchChange = (event) => {
    this.props.searchThis(event, () => {
      this.autocompleteSearchDebounced();
    });
  };
  autocompleteSearch = () => {
    const { offset, fetchBooks, history, searchTerm } = this.props;
    const { language, category, authors, sliderValues } = this.state;
    const authors_array = Array.from(authors.entries()).join(",");

    const endpoint = bookListURL(
      offset,
      language,
      authors_array,
      category,
      sliderValues,
      searchTerm
    );
    history.push(endpoint.slice(endpoint.indexOf("?limit"), endpoint.length));
    fetchBooks(endpoint);
  };
  trackScrolling = () => {
    const el = document.getElementById("fixed-header");
    if (el.getBoundingClientRect().top < -100) {
      el.classList.add("header-fixed");
    } else {
      el.classList.remove("header-fixed");
    }
  };
  handleOpenCookies = () => {
    this.setState((prevState) => {
      return { ...prevState, modalOpen: true };
    });
  };
  handleCloseNoCookies = () => {
    this.setState((prevState) => {
      return { ...prevState, modalOpen: false };
    });
    posthog.opt_out_capturing();
    document.cookie = "cookies=false";
  };
  handleCloseYesCookies = () => {
    this.setState((prevState) => {
      return { ...prevState, modalOpen: false };
    });
    document.cookie = "cookies=true";
  };

  componentDidMount() {
    // runs once on start up of the app
    document.addEventListener("scroll", this.trackScrolling);

    const grabThemCookies = new Promise((resolve, reject) => {
      resolve(this.props.grabCookies());
    });
    grabThemCookies.then((_) => {
      this.props.cookieConsent == null &&
        setTimeout(() => this.handleOpenCookies(), 5000);
    });

    const q = queryString.parse(this.props.location.search);
    if (Object.keys(q).length > 0 && this.props.location.pathname == "/") {
      // parameter search, handle string parameters
      // e.g. visit '?limit=12&offset=0&language=&authors=blabla'
      this.mapUrlToState(q);
    }
  }

  handleAuthorStringParams = (queryMap) => {
    const authors_param = queryMap.authors;
    if (authors_param !== undefined) {
      // authors_param string --> authors_param Map
      // e.g. Eça de Queirós,true -->  Map{ "Eça de Queirós" → true }
      let urlAuthorMap = new Map();
      let result = [];
      for (var i = 0; i < authors_param.split(",").length; i += 2) {
        result.push([
          authors_param.split(",")[i],
          authors_param.split(",")[i + 1],
        ]);
      }
      result.forEach((element) => {
        urlAuthorMap.set(element[0], element[1] === "true");
      });
      return { ...queryMap, authors: urlAuthorMap };
    }
    return queryMap;
  };

  mapUrlToState = (queryMap) => {
    queryMap = this.handleAuthorStringParams(queryMap);

    this.setState(queryMap, () => {
      const { offset, fetchBooks, searchTerm } = this.props;
      const { language, category, authors, sliderValues } = this.state;
      let authors_array = "";
      if (queryMap.authors) {
        authors_array = Array.from(queryMap.authors.entries()).join(",");
      }

      const endpoint = bookListURL(
        offset,
        language,
        authors_array,
        category,
        sliderValues,
        searchTerm || queryMap.text
      );
      fetchBooks(endpoint);
    });
  };

  componentWillUnmount = () => {
    document.removeEventListener("scroll", this.trackScrolling);
  };

  clearFilters = () => {
    /* FIX ME, changing the state 
    is not triggering page refresh */

    this.setState(
      {
        language: "",
        authors: new Map(),
        category: "",
        sliderValues: [0, 100],
        search: "",
      },
      () => {
        fetchBooks(bookListURL());
        this.props.history.push("/");
        window.location.reload();
      }
    );
  };
  onSelectAuthor = (e, data) => {
    const item = e.target.textContent;
    const isChecked = data.checked;
    this.setState(
      (prevState) => ({
        authors: prevState.authors.set(item, isChecked),
      }),
      () => {
        const { offset, fetchBooks, history, searchTerm } = this.props;
        const { language, category, authors, sliderValues } = this.state;
        const authors_array = Array.from(authors.entries()).join(",");

        const endpoint = bookListURL(
          offset,
          language,
          authors_array,
          category,
          sliderValues,
          searchTerm
        );
        history.push(
          endpoint.slice(endpoint.indexOf("?limit"), endpoint.length)
        );
        fetchBooks(endpoint);
      }
    );
  };

  handleSetActiveCategory = (event) => {
    this.setState(
      { category: event.currentTarget.attributes.val.value },
      () => {
        const { offset, fetchBooks, history, searchTerm } = this.props;
        const { language, category, authors, sliderValues } = this.state;
        const authors_array = Array.from(authors.entries()).join(",");
        const endpoint = bookListURL(
          offset,
          language,
          authors_array,
          category,
          sliderValues,
          searchTerm
        );
        history.push(
          endpoint.slice(endpoint.indexOf("?limit"), endpoint.length)
        );
        fetchBooks(endpoint);
      }
    );
  };

  onSelectRadio = (event) => {
    this.setState({ language: event.currentTarget.value }, () => {
      const { offset, fetchBooks, history, searchTerm } = this.props;
      const { language, category, authors, sliderValues } = this.state;
      const authors_array = Array.from(authors.entries()).join(",");
      const endpoint = bookListURL(
        offset,
        language,
        authors_array,
        category,
        sliderValues,
        searchTerm
      );
      history.push(endpoint.slice(endpoint.indexOf("?limit"), endpoint.length));
      fetchBooks(endpoint);
    });
  };

  onSliderChange = (sliderValues) => {
    this.setState({ sliderValues: sliderValues }, () => {
      const { offset, fetchBooks, history, searchTerm } = this.props;
      const { language, category, authors, sliderValues } = this.state;
      const authors_array = Array.from(authors.entries()).join(",");
      const endpoint = bookListURL(
        offset,
        language,
        authors_array,
        category,
        sliderValues,
        searchTerm
      );
      history.push(endpoint.slice(endpoint.indexOf("?limit"), endpoint.length));
      fetchBooks(endpoint);
    });
  };

  render() {
    const {
      authenticated,
      cart,
      error,
      errorCart,
      success,
      fetchBooks,
      user_name,
    } = this.props;
    const { language, sliderValues, authors, category, modalOpen } = this.state;
    return (
      <React.Fragment>
        {/* Header Section Begin */}
        
        <header className="header-section" id="fixed-header">
          <div className="wrap-menu-header">
            <div className="container">
              <div className="inner-header">
                <div className="row">
                  <div className="col-lg-2 col-md-2">
                    <a href="https://www.lapetiteportugaise.eu/">
                      <img
                        className="logo"
                        src="https://lapetiteportugaise.thekor.eu/static/frontend/logopetiteportugaise300.png"
                        alt="la petite portugaise's logo"
                      />
                    </a>
                  </div>
                  <TopNavigationWithAuthenticationHandlingAndErrorHandling
                    authenticated={authenticated}
                    cart={cart}
                    onSearchChange={this.onSearchChange}
                    error={error}
                    errorCart={errorCart}
                    success={success}
                    user_name={user_name}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* {modalOpen && (
          <ModalCookies
            handleCloseYesCookies={this.handleCloseYesCookies}
            handleCloseNoCookies={this.handleCloseNoCookies}
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          />
        )} */}
        <BaseRouter
          onSelectAuthor={this.onSelectAuthor}
          onSliderChange={this.onSliderChange}
          onSelectRadio={this.onSelectRadio}
          handleSetActiveCategory={this.handleSetActiveCategory}
          language={language}
          sliderValues={sliderValues}
          authors={authors}
          category={category}
          error={error}
          errorCart={errorCart}
          clearFilters={this.clearFilters}
        />
        <BottomNavigation />

        {/* Header End */}
      </React.Fragment>
    );
  }
}

const TopNavigationWithAuthenticationHandling = withAuthentication(
  TopNavigationWithAuth,
  TopNavigationNoAuth
);

const TopNavigationWithAuthenticationHandlingAndErrorHandling = withError(
  TopNavigationWithAuthenticationHandling
);

// CustomLayout.propTypes = propTypes;

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    user_name: state.auth.user_name,
    cookieConsent: state.auth.cookieConsent,
    cart: state.cart.shoppingCart,
    searchTerm: state.navigation.searchTerm,
    offset: state.books.offset,
    error: state.book.error,
    errorCart: state.cart.error,
    success: state.book.success,
    dataLength: state.books.data.length,
    shoppingCart: state.cart.shoppingCart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchThis: (e, callback) => dispatch(searchThis(e, callback)),
    loadMoar: (url_endpoint, bookPerPage, offset) =>
      dispatch(loadmoar(url_endpoint, bookPerPage, offset)),
    fetchBooks: (url_endpoint) => dispatch(fetchBooks(url_endpoint)),
    refreshCart: () => dispatch(fetchCart()),
    searchThis: (e, callback) => dispatch(searchThis(e, callback)),
    userIsStaff: (e) => dispatch(userIsStaff(e)),
    grabCookies: () => dispatch(grabCookies()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);
