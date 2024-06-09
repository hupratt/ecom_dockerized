import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { fetchBook } from "../../../actions/book";
import { fetchCart, handleAddToCart } from "../../../actions/cart";
import { withError, withLoading } from "../../../hoc/hoc";
import BookDetail from "./BookDetail";
import { fetchBooks } from "../../../actions/books";
import { Trans } from "react-i18next";
import { userIsStaff } from "../../../actions/auth";

const propTypes = {
  book: PropTypes.object.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errorCart: PropTypes.object,
  error: PropTypes.object,
};

class BookDetailPage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.fetchBook(
      this.props.match.params.bookID,
      this.props.dataIsCached
    );
    if (this.props.isAuthenticated == true && this.props.shoppingCart == null) {
      this.props.refreshCart();
    }
    if (this.props.user_staff == null) {
      this.props.userIsStaff();
    }
  }

  render() {
    const {
      book,
      handleAddToCart,
      isAuthenticated,
      error,
      errorCart,
      history,
      user_name,
      user_staff,
      loading,
      distinct_id,
      email,
    } = this.props;
    const user = { user_name, user_staff, distinct_id, email };
    return (
      <React.Fragment>
        {/* Breadcrumb Section Begin */}
        <div className="breacrumb-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-text product-more">
                  <Link to="/">
                    <i className="fas fa-home" /> <Trans i18nKey="Home" />
                  </Link>
                  <span
                    style={{
                      color: "#252525",
                    }}
                  >
                    <Trans i18nKey="Detail" />
                  </span>
                  {user_name && (
                    <React.Fragment>
                      <p>
                        Olá {user_name},
                        <button
                          onClick={() =>
                            this.props.history.push(`/books/${book.id}/edit`)
                          }
                        >
                          Edit this book
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
              </div>
            </div>
            {/* Breadcrumb Section End */}
          </div>
        </div>
        {book && (
          <Container>
            <BookDetailWithLoading
              handleAddToCart={handleAddToCart}
              book={book}
              isAuthenticated={isAuthenticated}
              error={error}
              errorCart={errorCart}
              history={history}
              user={user}
              loading={loading}
            />
          </Container>
        )}
      </React.Fragment>
    );
  }
}

const BookDetailWithLoading = withLoading(BookDetail);

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBooks: (url_endpoint) => dispatch(fetchBooks(url_endpoint)),

    fetchBook: (id, dataIsCached) => dispatch(fetchBook(id, dataIsCached)),
    handleAddToCart: (id, isAuthenticated) =>
      dispatch(handleAddToCart(id, isAuthenticated)),
    userIsStaff: () => dispatch(userIsStaff()),
    refreshCart: () => dispatch(fetchCart()),
  };
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    user_name: state.auth.user_name,
    user_staff: state.auth.user_staff,
    distinct_id: state.auth.distinct_id,
    email: state.auth.email,
    loading: state.book.loading,
    error: state.book.error,
    errorCart: state.cart.error,
    data: state.book.data,
    book: state.book.book,
    dataIsCached: state.book.dataIsCached,
    shoppingCart: state.cart.shoppingCart,
    offset: state.books.offset,
  };
};

BookDetailPage.propTypes = propTypes;

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookDetailPage)
);
