import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { s3_base_url } from "../../../constants";
import SearchNav from "./SearchNav";

const propTypes = {
  cart: PropTypes.object,
};

const TopNavigationWithAuth = ({ cart, onSearchChange }) => {
  return (
    <React.Fragment>
      <SearchNav onSearchChange={onSearchChange} />
      <div className="col-lg-3 text-right col-md-3">
        <ul className="nav-right">
          <Link to="/profile">
            <li className="user-icon">
              <i className="far fa-user" /> <span></span>
            </li>
          </Link>

          <li className="cart-icon">
            <a href="#">
              <i className="fa fa-shopping-bag" />
              {cart && cart.order_items && (
                <span>{cart.order_items.length}</span>
              )}
            </a>
            {cart && cart.order_items && (
              <div className="cart-hover">
                <div className="select-items">
                  <table>
                    <tbody>
                      {cart.order_items.map((order_item) => {
                        return (
                          <tr key={order_item.id}>
                            <td className="si-pic">
                              <img src={order_item.livre.picture} alt="" />
                            </td>
                            <td className="si-text">
                              <div className="product-selected">
                                <p>
                                  {order_item.livre.prix} x{" "}
                                  {order_item.quantity} €
                                </p>
                                <h6>{order_item.livre.titre}</h6>
                              </div>
                            </td>
                            <td className="si-close">
                              <i className="ti-close" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="select-total">
                  <span>total:</span>
                  <h5>{cart && cart.total} €</h5>
                </div>
                <div className="select-button">
                  <Link to="/order-summary" className="primary-btn view-card">
                    VIEW CART
                  </Link>
                  <Link to="/checkout" className="primary-btn checkout-btn">
                    CHECK OUT
                  </Link>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

TopNavigationWithAuth.propTypes = propTypes;

export default TopNavigationWithAuth;
