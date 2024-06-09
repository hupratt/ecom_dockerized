import React from "react";
import { connect } from "react-redux";
import { loadmoar } from "../../../actions/books";
import BooksPlusPaginationAndFilters from "./BooksPlusPaginationAndFilters";
import { withLoading, withError } from "../../../hoc/hoc";
import PropTypes from "prop-types";
import { bookListURL, base } from "../../../constants";
import { Link, withRouter } from "react-router-dom";
import { fetchCart } from "../../../actions/cart";
import { Trans } from "react-i18next";
import { fetchBooks } from "../../../actions/books";
import queryString from "query-string";
import { userIsStaff } from "../../../actions/auth";
import CallToAction from "../../Buttons/CallToAction";
import _ from "lodash";
import posthog from "posthog-js";

const propTypes = {
  data: PropTypes.array.isRequired,
  error: PropTypes.object,
  loading: PropTypes.bool,
  bookPerPage: PropTypes.number.isRequired,
};
class BookList extends React.Component {
  state = { user_staff: null, user_staff: null };
  componentDidMount() {
    document.addEventListener("scroll", this.trackScrolling);
    const q = queryString.parse(this.props.location.search);
    if (Object.keys(q).length == 0 && this.props.dataLength == 0) {
      this.props.fetchBooks(bookListURL());
    } else if (
      (this.props.language.length > 0) |
      (this.props.authors.size > 0) |
      (this.props.category.length > 0) |
      (JSON.stringify(this.props.sliderValues) !==
        JSON.stringify(Array(0, 100))) |
      (this.props.searchTerm.length > 0)
    ) {
      this.mapStateToUrl();
    }
    if (this.props.isAuthenticated == true && this.props.shoppingCart == null) {
      this.props.refreshCart();
    }
    if (this.props.user_staff == null) {
      this.props.userIsStaff();
    }
  }
  componentWillUnmount = () => {
    document.removeEventListener("scroll", this.trackScrolling);
  };

  recordWithPosthogDetail = (id) => {
    const { user_name, email, distinct_id } = this.props;
    if (
      process.env.POSTHOG_KEY &&
      distinct_id &&
      posthog.has_opted_out_capturing() == false
    ) {
      posthog.capture("$pageview", {
        distinct_id,
        $current_url: `${base}/books/${id}`,
      });
      posthog.identify(distinct_id);
      posthog.people.set({ email, user_name });
      console.log(`Detail view: ${user_name} ${email} ${distinct_id}`);
    }
  };

  mapStateToUrl = () => {
    const {
      offset,
      history,
      searchTerm,
      language,
      category,
      authors,
      sliderValues,
    } = this.props;
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
  };
  handleClickOnBook = (id) => {
    this.props.history.push(`/books/${id}`);
    this.recordWithPosthogDetail(id);
  };

  isBottom = (el) => {
    if (el)
      return (
        el.getBoundingClientRect().bottom <=
        window.innerHeight + el.getBoundingClientRect().bottom / 10
      );
  };

  trackScrolling = () => {
    const wrappedElement = document.getElementById("loadmoar");
    const {
      _length,
      loading,
      loadMoar,
      offset,
      language,
      authors,
      category,
      bookPerPage,
      moreloading,
      sliderValues,
      searchTerm
    } = this.props;
    if (
      this.isBottom(wrappedElement) &&
      loading == false &&
      moreloading == false &&
      offset + 12 < _length
    ) {
      loadMoar(
        bookListURL(
          offset + 12,
          language,
          Array.from(authors.entries()).join(","),
          category,
          sliderValues,
          searchTerm
        ),
        bookPerPage + 12,
        offset + 12
      );
    }
  };

  render() {
    const {
      data,
      bookPerPage,
      _length,
      onSelectAuthor,
      language,
      authors,
      sliderValues,
      onSelectRadio,
      handleSetActiveCategory,
      onSliderChange,
      error,
      errorCart,
      isAuthenticated,
      user_name,
      user_staff,
      loading,
      clearFilters,
    } = this.props;
    return (
      <React.Fragment>
        {/* Breadcrumb Section Begin */}
        <div className="breacrumb-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-text">
                  <a>
                    <i className="fa fa-home" /> <Trans i18nKey="Home" />
                  </a>
                  <span>
                    <Trans i18nKey="Detail" />
                  </span>
                  {user_name && (
                    <React.Fragment>
                      <p>
                        Olá {user_name},
                        <button
                          onClick={() => this.props.history.push(`/book/add`)}
                        >
                          + Add a book
                        </button>
                      </p>
                    </React.Fragment>
                  )}
                  {!user_name && (
                    <button onClick={() => this.props.history.push(`/login`)}>
                      Log in
                    </button>
                  )}
                </div>
                {_.size(queryString.parse(this.props.location.search)) > 0 && (
                  <button onClick={clearFilters} className="btn clear-filters">
                    <Trans i18nKey="Clear filters" />
                  </button>
                )}
                {/* <CallToAction
                  handleSetActiveCategory={handleSetActiveCategory}
                /> */}
              </div>
            </div>
          </div>
        </div>
        {/* Breadcrumb Section Begin */}

        <BookPageWithLoading
          bookPerPage={bookPerPage}
          length={_length}
          onSelectRadio={onSelectRadio}
          onSelectAuthor={onSelectAuthor}
          paginatedData={data}
          language={language}
          handleClickOnBook={this.handleClickOnBook}
          handleSetActiveCategory={handleSetActiveCategory}
          authors={authors}
          onSliderChange={onSliderChange}
          sliderValues={sliderValues}
          error={error}
          errorCart={errorCart}
          loading={loading}
        />

        {this.props.children}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadMoar: (url_endpoint, bookPerPage, offset) =>
      dispatch(loadmoar(url_endpoint, bookPerPage, offset)),
    fetchBooks: (url_endpoint) => dispatch(fetchBooks(url_endpoint)),
    userIsStaff: () => dispatch(userIsStaff()),
    refreshCart: () => dispatch(fetchCart()),
  };
};

const BookPageWithLoading = withLoading(BooksPlusPaginationAndFilters);

const mapStateToProps = (state) => {
  return {
    data: state.books.data,
    loading: state.books.loading,
    moreloading: state.books.moreloading,
    offset: state.books.offset,
    bookPerPage: state.books.bookPerPage,
    _length: state.books._length,
    searchTerm: state.navigation.searchTerm,
    error: state.book.error,
    errorCart: state.cart.error,
    dataLength: state.books.data.length,
    isAuthenticated: state.auth.token !== null,
    user_name: state.auth.user_name,
    user_staff: state.auth.user_staff,
    distinct_id: state.auth.distinct_id,
    email: state.auth.email,
    shoppingCart: state.cart.shoppingCart,
  };
};

BookList.propTypes = propTypes;

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookList)
);
