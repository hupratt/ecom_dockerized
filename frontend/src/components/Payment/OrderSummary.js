import React from "react";
import {
  Container,
  Dimmer,
  Header,
  Loader,
  Table,
  Button,
  Message,
  Segment,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import {
  orderSummaryURL,
  orderItemDeleteURL,
  orderItemUpdateQuantityURL,
} from "../../constants";
import axios from "axios";
import { fetchCart } from "../../actions/cart";

class OrderSummary extends React.Component {
  state = {
    data: null,
    error: null,
    loading: false,
  };

  componentDidMount() {
    this.handleFetchOrder();
  }

  handleFetchOrder = () => {
    this.setState({ loading: true });
    axios
      .get(orderSummaryURL)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.setState({
            error: "You currently do not have an order",
            loading: false,
          });
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };

  handleAddQuantityToCart = (id) => {
    this.setState({ loading: true });
    // const variations = this.handleFormatData(itemVariations);
    axios
      .post(orderItemUpdateQuantityURL, { id: id, type: "add" })
      .then((res) => {
        this.handleFetchOrder();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleRemoveQuantityFromCart = (id) => {
    this.setState({ loading: true });
    axios
      .post(orderItemUpdateQuantityURL, { id: id, type: "remove" })
      .then((res) => {
        this.handleFetchOrder();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleCancelOrder = (itemID) => {
    axios
      .delete(orderItemDeleteURL(itemID))
      .then((res) => {
        this.handleFetchOrder();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  render() {
    const { data, error, loading } = this.state;
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <Container style={{ marginTop: 200 }}>
        <Header>Order Summary</Header>
        {error && (
          <Message
            error
            header="There was an error"
            content={JSON.stringify(error)}
          />
        )}
        {loading ? (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          </Segment>
        ) : data ? (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Item #</Table.HeaderCell>
                <Table.HeaderCell>Item name</Table.HeaderCell>
                <Table.HeaderCell>Item price</Table.HeaderCell>
                <Table.HeaderCell>Item quantity</Table.HeaderCell>
                <Table.HeaderCell>Total item price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.order_items.map((orderItem, i) => {
                return (
                  <Table.Row key={orderItem.id}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>
                      {orderItem.livre.titre} - {orderItem.livre.langue_nom}
                    </Table.Cell>
                    <Table.Cell>${orderItem.livre.prix}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <i
                        className="fas fa-minus"
                        style={{ float: "left", cursor: "pointer" }}
                        onClick={() => {
                          this.handleRemoveQuantityFromCart(orderItem.livre.id);
                        }}
                      />
                      {orderItem.quantity}
                      <i
                        className="fas fa-plus"
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={() => {
                          this.handleAddQuantityToCart(orderItem.livre.id);
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      ${orderItem.quantity * orderItem.livre.prix}
                      <i
                        className="far fa-trash-alt"
                        style={{
                          float: "right",
                          cursor: "pointer",
                          color: "red",
                        }}
                        onClick={() => {
                          this.handleCancelOrder(orderItem.id);
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell textAlign="right" colSpan="2">
                  Total: ${data.total}
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5">
                  <Link to="/checkout">
                    <Button floated="right" color="yellow">
                      Checkout
                    </Button>
                  </Link>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default withRouter(connect(mapStateToProps)(OrderSummary));
