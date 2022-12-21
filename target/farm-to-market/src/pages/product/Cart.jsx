import {
  faMinus,
  faMoneyBillAlt,
  faPesoSign,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  deleteOrder,
  getMyOrders,
  orderQuantity,
  selectOrder,
} from "../../services/cart";
import { addBulkOrders } from "../../services/order";
import { transac } from "../../services/transaction";
import { getUserInfo } from "../../services/userInf";

const Checkout = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const [all, setAll] = useState(true);
  const [cart, setCart] = useState(null);
  useEffect(() => {
    getProductOrders();
  }, []);

  const handleQuantity = (type, rowData) => {
    orderQuantity(type, rowData.cart_id).then((res) => {
      if (res.data && res.data.status === 1) {
        getProductOrders();
      }
    });
  };
  const handleOnChange = (e) => {
    e.preventDefault();
  };

  const getProductOrders = () => {
    if (userInfo) {
      getMyOrders(userInfo.data.user_id).then((res) => {
        if (res.data) {
          setCart(res.data);
          var selectedOrder = 0;
          res.data.map((o) => {
            if (o.selected) {
              selectedOrder++;
            }
          });
          if (res.data.length === selectedOrder) {
            setAll(true);
          } else {
            setAll(false);
          }
        }
      });
    }
  };

  const handleOnDelete = (row) => {
    deleteOrder(row.cart_id).then((res) => {
      if (res.data && res.data.status === 1) {
        getProductOrders();
      }
    });
  };

  const handleRowChecked = (id, type) => {
    if (type === "all") {
      setAll(!all);
    }
    selectOrder(id, type, !all).then((res) => {
      if (res.data && res.data.status === 1) {
        getProductOrders();
      }
    });
  };

  const subTotal = () => {
    var total = 0;
    if (cart) {
      cart.map((o) => {
        if (o.selected) {
          total += o.total;
        }
      });
    }

    return total;
  };

  const checkoutOrder = (code) => {
    const transactionData = {
      status: "",
      pamentStatus: "Pending",
      paymentType: "",
      buyer: getUserInfo().data,
      subtotal: subTotal(),
    };

    transac(transactionData, code).then((res) => {
      if (res.data && res.data.status === 1) {
        const result = res.data.data;
        navigate(`/checkout/${result.code}`);
      }
    });
  };

  const addBulkOrder = () => {
    if (!!getUserInfo().data.address) {
      const orderData = cart.filter((c) => c.selected);
      addBulkOrders(orderData).then((res) => {
        if (res.data && res.data.status === 1) {
          checkoutOrder(res.data.message);
        }
      });
    } else {
      navigate("/profile?target=address");
    }
  };

  if (cart && cart.length > 0) {
    return (
      <Container className="mb-4 mt-4">
        <Card>
          <Card.Body>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center">
                      <input
                        type="checkbox"
                        checked={all}
                        readOnly
                        onChange={() =>
                          handleRowChecked(getUserInfo().data.user_id, "all")
                        }
                      />
                    </th>
                    <th>Product</th>
                    <th className="text-center">Unit Price</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center"> Total</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c, idx) => (
                    <tr key={idx}>
                      <td className="text-center">
                        <div className="table-f-data">
                          <input
                            type="checkbox"
                            checked={c.selected}
                            readOnly
                            onChange={() => handleRowChecked(c.cart_id, "1")}
                          />
                        </div>
                      </td>
                      <td className="product-desc">
                        <div className="d-flex">
                          <img
                            src={require(`../../assets/uploads/${c.product.image}`)}
                            alt="Product"
                            width="100"
                            height="90"
                            className="me-2"
                          />
                          <p className="text-capitalize ">
                            {c.product.description}
                          </p>
                        </div>
                      </td>
                      <td className="text-end">
                        <span className="table-f-data">
                          <FontAwesomeIcon size="xs" icon={faPesoSign} />
                          {c.product.price}
                        </span>
                      </td>
                      <td>
                        <div className="table-f-data">
                          <div className="d-flex justify-content-center">
                            <button
                              className="q-counter-btn"
                              onClick={() => handleQuantity("minus", c)}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <input
                              className="q-counter"
                              value={c.quantity}
                              onChange={(e) => handleOnChange(e, c)}
                            />
                            <button
                              className="q-counter-btn"
                              onClick={() => handleQuantity("plus", c)}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        <span className="table-f-data">
                          <FontAwesomeIcon size="xs" icon={faPesoSign} />
                          {c.total}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="table-f-data">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleOnDelete(c)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center p-2 justify-content-end order-footer ">
              <div className="d-flex align-items-center me-3 mb-2">
                <div className="text-danger">
                  <span className="me-3 ">Subtotal</span>
                  <span>
                    <FontAwesomeIcon size="xs" icon={faPesoSign} />
                    {subTotal()}
                  </span>
                </div>
              </div>

              <button
                className="btn btn-warning mb-2"
                onClick={addBulkOrder}
                disabled={subTotal() === 0 ? true : false}
              >
                <FontAwesomeIcon icon={faMoneyBillAlt} className="me-3" />
                Checkout
              </button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mb-4 mt-4">
      <div className="empty-cart">
        <h2>No available order</h2>
        <Link to="/" className="btn btn-f-primary">
          Shop now
        </Link>
      </div>
    </Container>
  );
};

export default Checkout;
