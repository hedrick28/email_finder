import { faLocationPin, faPesoSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  gcashPaymentTransaction,
  getTransaction,
  paynow,
  paynowCODandPickup,
} from "../../services/transaction";

const Checkout = () => {
  const param = useParams();
  const [transaction, setTransaction] = useState(null);
  const [paymentType, setPaymentType] = useState("cod");
  const cod = 150;
  const navigate = useNavigate();
  useEffect(() => {
    getTransaction(param.code).then((res) => {
      if (res.data && res.data.status === 1) {
        setTransaction(res.data.data);
      } else if (res.data && res.data.status === 0) {
        navigate("/cart");
      } else {
        navigate("/");
      }
    });
  }, [param]);

  const handlePaynow = () => {
    var total =
      paymentType !== "pickup"
        ? transaction.subtotal + cod
        : transaction.subtotal;
    const data = {
      ...transaction,
      grandTotal: total,
      paymentType: paymentType,
    };

    if (paymentType === "creditcard") {
      paynow(data).then((res) => {
        if (res.data && res.data.status === 1) {
          window.location.href = res.data.data;
        }
      });
    } else if (paymentType === "pickup" || paymentType === "cod") {
      paynowCODandPickup(data).then((res) => {
        if (res.data && res.data.status === 1) {
          navigate(`/checkout/status/success/${res.data.data.code}`);
        }
      });
    } else if (paymentType === "gcash" || paymentType === "paymaya") {
      sessionStorage.setItem("transaction", JSON.stringify(data));
      navigate("/checkout/payment/gcash");
    }
  };

  if (transaction) {
    return (
      <Container className="mb-4 mt-4">
        <Row>
          <Col lg={6}>
            <Card className="mb-2">
              <Card.Header className="text-center">
                <Card.Title>Order Summary</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-center">Title</th>
                        <th className="text-center">Unit Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.orders.map((order, idx) => (
                        <tr className="text-center" key={idx}>
                          <td>{order.product.productName}</td>
                          <td>
                            <FontAwesomeIcon icon={faPesoSign} size="xs" />
                            {order.product.price}
                          </td>
                          <td>{order.quantity}</td>
                          <td>
                            <FontAwesomeIcon icon={faPesoSign} size="xs" />
                            {order.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Row>
                  <Col>
                    <Row className="ms-3 me-3">
                      <Col sm={5}>Date</Col>
                      <Col sm={7} className="text-end">
                        {transaction.transactionDate}
                      </Col>
                    </Row>
                    <Row className="ms-3 me-3">
                      <Col sm={6}>Subtotal</Col>
                      <Col sm={6} className="text-end">
                        <FontAwesomeIcon icon={faPesoSign} size="xs" />
                        {transaction.subtotal}
                      </Col>
                    </Row>
                    {paymentType !== "pickup" && (
                      <Row className="ms-3 me-3">
                        <Col sm={6}>Shipping</Col>
                        <Col sm={6} className="text-end">
                          <FontAwesomeIcon icon={faPesoSign} size="xs" />
                          {cod}
                        </Col>
                      </Row>
                    )}
                    <Row className="ms-3 me-3">
                      <Col sm={6}>Total</Col>
                      <Col sm={6} className="text-end">
                        <FontAwesomeIcon icon={faPesoSign} size="xs" />
                        {paymentType !== "pickup"
                          ? transaction.subtotal + cod
                          : transaction.subtotal}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mb-2">
              <Card.Body>
                <Row>
                  <Col lg={12}>
                    <div>
                      <FontAwesomeIcon icon={faLocationPin} className="me-2" />
                      <span>Delivery Address</span>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <span className="ms-3 text-capitalize fw-bold">
                      {transaction.buyer.firstName} {transaction.buyer.lastName}
                    </span>
                    <div className="ms-3">{`(${transaction.buyer.mobile})`}</div>
                    <div className="ms-3">
                      <span>
                        #{transaction.buyer.address.houseNo}&nbsp;
                        {transaction.buyer.address.street}&nbsp;
                        {transaction.buyer.address.barangay}&nbsp;
                        {transaction.buyer.address.city}&nbsp;
                        {transaction.buyer.address.province}&nbsp;
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="mb-2">
              <Card.Body>
                <div>
                  <label htmlFor="" className="mb-4">
                    Payment Method
                  </label>
                  <select
                    name=""
                    id=""
                    className="form-control"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <option value="cod">COD</option>
                    <option value="pickup">Pick up</option>
                    <option value="creditcard">Credit Card</option>
                    <option value="gcash">Gcash</option>
                    <option value="paymaya">Paymaya</option>
                    <option value="alleasy">AllEasy</option>
                  </select>
                </div>
              </Card.Body>
              <Card.Body className="pt-4 pb-4">
                <button
                  className="btn w-100 btn-f-primary"
                  onClick={handlePaynow}
                >
                  Place Order
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Checkout;
