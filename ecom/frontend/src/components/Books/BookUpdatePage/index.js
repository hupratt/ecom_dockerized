import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addBookItem, deleteBookItem, updateBook } from "../../../actions/book";
import FileForm from "./FileForm";
import { fetchBook } from "../../../actions/book";

class BookUpdatePage extends React.Component {
  state = {
    updatedBook: {
      auteur_nom: "",
      isbn: "",
      note: null,
      titre: "",
      prix: null,
      langue_nom: "",
      genre_nom: "",
      description: "",
      get_quantity: "",
      prix_barre: null,
    },
  };

  componentDidMount() {
    this.setState({
      updatedBook: this.props.book,
    });
  }

  handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState((prevState) => {
      return {
        updatedBook: {
          ...prevState.updatedBook,
          [name]: value,
        },
      };
    });
  };
  addBookItem = (e) => {
    e.preventDefault();
    this.props.addBookItem(this.state.updatedBook, this.props.history);
  };
  deleteBookItem = (e) => {
    e.preventDefault();
    this.props.deleteBookItem(this.state.updatedBook, this.props.history);
  };

  render() {
    const {
      auteur_nom,
      isbn,
      note,
      titre,
      prix,
      langue_nom,
      genre_nom,
      description,
      get_quantity,
      prix_barre,
    } = this.state.updatedBook;

    return (
      <React.Fragment>
        {this.props.book && (
          <div>
            <section className="product-shop spad page-details">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-6">
                        <img
                          className="product-big-img"
                          src={this.props.book.picture}
                          alt=""
                        />
                        <FileForm
                          book={this.state.updatedBook}
                          updateBook={this.props.updateBook}
                          history={this.props.history}
                        />
                      </div>

                      <div className="col-lg-6">
                        <div className="product-update">
                          <span>In stock: {get_quantity}</span>
                          <button onClick={this.addBookItem}>+</button>
                          <button onClick={this.deleteBookItem}>-</button>
                          <Input
                            name={"auteur_nom"}
                            title={"Author"}
                            type={"text"}
                            value={auteur_nom}
                            handleChange={this.handleInput}
                            placeholder={auteur_nom}
                          />
                          <Input
                            name={"isbn"}
                            title={"ISBN"}
                            type={"text"}
                            value={isbn}
                            handleChange={this.handleInput}
                            placeholder={isbn}
                          />
                          <Input
                            name={"titre"}
                            title={"Titre"}
                            type={"text"}
                            value={titre}
                            handleChange={this.handleInput}
                            placeholder={titre}
                          />
                          <Input
                            name={"note"}
                            title={"Note"}
                            type={"text"}
                            value={note}
                            handleChange={this.handleInput}
                            placeholder={note}
                          />
                          <Input
                            name={"prix"}
                            title={"Prix"}
                            type={"text"}
                            value={prix}
                            handleChange={this.handleInput}
                            placeholder={prix}
                          />
                          <Input
                            name={"prix_barre"}
                            title={"Prix précédent"}
                            type={"text"}
                            value={prix_barre}
                            handleChange={this.handleInput}
                            placeholder={prix_barre}
                          />
                          <Input
                            name={"langue_nom"}
                            title={"Langue"}
                            type={"text"}
                            value={langue_nom}
                            handleChange={this.handleInput}
                            placeholder={langue_nom}
                          />
                          <Input
                            name={"genre_nom"}
                            title={"Genre"}
                            type={"text"}
                            value={genre_nom}
                            handleChange={this.handleInput}
                            placeholder={genre_nom}
                          />
                          <TextArea
                            name={"description"}
                            title={"Description"}
                            type={"text"}
                            value={description}
                            handleChange={this.handleInput}
                            placeholder={description}
                            rows={15}
                            cols={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            )
          </div>
        )}
      </React.Fragment>
    );
  }
}

const Input = (props) => (
  <div className="form-group">
    <label htmlFor={props.name || ""} className="form-label">
      {props.title || ""}
    </label>
    <input
      className="form-input"
      id={props.name || ""}
      name={props.name || ""}
      type={props.type || ""}
      value={props.value || ""}
      onChange={props.handleChange}
      placeholder={props.placeholder || ""}
      ref={props.ref}
    />
  </div>
);

const TextArea = (props) => (
  <div className="form-group">
    <label className="form-label">{props.title}</label>
    <textarea
      className="form-control"
      name={props.name}
      rows={props.rows}
      cols={props.cols}
      value={props.value}
      onChange={props.handleChange}
      placeholder={props.placeholder}
    />
  </div>
);

const mapDispatchToProps = (dispatch) => {
  return {
    addBookItem: (updatedBook, history) =>
      dispatch(addBookItem(updatedBook, history)),
    deleteBookItem: (updatedBook, history) =>
      dispatch(deleteBookItem(updatedBook, history)),
    fetchBook: (id, dataIsCached) => dispatch(fetchBook(id, dataIsCached)),
    updateBook: (formData, setUploadPercentage, urlendpoint, history, book) =>
      dispatch(
        updateBook(formData, setUploadPercentage, urlendpoint, history, book)
      ),
  };
};

const mapStateToProps = (state) => {
  return {
    book: state.book.book,
    isAuthenticated: state.auth.token !== null,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookUpdatePage)
);
