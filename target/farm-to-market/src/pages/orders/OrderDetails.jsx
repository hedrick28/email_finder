import {
  faArrowCircleLeft,
  faEllipsisV,
  faPesoSign,
  faCancel,
  faClose,
  faTrashAlt,
  faTruckDroplet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { deliverOrder, orderDetails } from "../../services/order";
import { getUserInfo } from "../../services/userInf";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const userInfo = getUserInfo() && getUserInfo().data;
  const param = useParams();
  const type = param.type;
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    getOrderDetails();
  }, [param]);

  const handleBack = () => {
    if (type === "orders") {
      navigate("/orders");
    } else {
      navigate("/mypurchases");
    }
  };
  const handleDeliver = (id, type) => {
    deliverOrder(id, type).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        getOrderDetails();
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };
  const getOrderDetails = () => {
    orderDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setOrder(res.data.data);
      } else if (res.data && res.data.status === 0) {
        navigate("/orders");
      }
    });
  };
  if (order) {
    return (
      <Container className="mb-4 mt-4">
        <div className="d-sm-flex justify-content-between mb-3">
          <h3 className="mb-3">
            {type === "orders" ? "Order Details" : "Purchase Details"}
          </h3>
          <button className="btn btn-f-primary" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowCircleLeft} className="me-3" />
            <span>Back</span>
          </button>
        </div>
        <Card className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-end me-1 mt-1">
              <Dropdown className="d-dropdown">
                <Dropdown.Toggle>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    disabled={
                      order.status === "Delivered" ||
                      order.status === "Canceled"
                        ? false
                        : true
                    }
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="me-3 text-danger"
                    />
                    <span>Delete</span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleDeliver(order.order_id, "Canceled")}
                    disabled={
                      order.status === "Canceled" ||
                      order.status === "Delivered"
                        ? true
                        : false
                    }
                  >
                    <FontAwesomeIcon
                      icon={faClose}
                      className="me-3 text-warning"
                    />
                    <span>
                      {order.status === "Canceled" ? "Canceled" : "Cancel"}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleDeliver(order.order_id, "Shipped")}
                    disabled={
                      order.status === "Shipped" || order.status === "Delivered"
                        ? true
                        : false
                    }
                  >
                    <FontAwesomeIcon
                      icon={faTruckDroplet}
                      className="me-3 text-info"
                    />
                    <span>
                      {order.status === "Shipped" ? "Shipped" : "Ship"}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleDeliver(order.order_id, "Pending")}
                    disabled={order.status === "Delivered" ? true : false}
                  >
                    <FontAwesomeIcon
                      icon={faCancel}
                      className="me-3 text-warning"
                    />
                    <span>Pending</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Row>
              <Col sm={6} className="mb-3">
                <Row>
                  <Col sm={6} className="fw-bold text-uppercase">
                    Order date
                  </Col>
                  <Col sm={6} className="text-capitalize">
                    {order.orderDate}
                  </Col>
                </Row>
              </Col>
              {order.code && (
                <Col sm={6} className="mb-3">
                  <Row>
                    <Col sm={6} className="fw-bold text-uppercase">
                      Tracking No
                    </Col>
                    <Col sm={6} className="text-capitalize">
                      {order.code}
                    </Col>
                  </Row>
                </Col>
              )}
              {order.paymentType && (
                <Col sm={6} className="mb-3">
                  <Row>
                    <Col sm={6} className="fw-bold text-uppercase">
                      Payment type
                    </Col>
                    <Col sm={6} className="text-uppercase">
                      {order.paymentType}
                    </Col>
                  </Row>
                </Col>
              )}
              {order.quantity && (
                <Col sm={6} className="mb-3">
                  <Row>
                    <Col sm={6} className="fw-bold text-uppercase">
                      Quantity
                    </Col>
                    <Col sm={6} className="text-capitalize">
                      {order.quantity}
                    </Col>
                  </Row>
                </Col>
              )}
              {order.total && (
                <Col sm={6} className="mb-3">
                  <Row>
                    <Col sm={6} className="fw-bold text-uppercase">
                      total
                    </Col>
                    <Col sm={6} className="text-capitalize">
                      <FontAwesomeIcon icon={faPesoSign} size="xs" />
                      {order.total}
                    </Col>
                  </Row>
                </Col>
              )}
              {order.status && (
                <Col sm={6} className="mb-3">
                  <Row>
                    <Col sm={6} className="fw-bold text-uppercase">
                      Status
                    </Col>
                    <Col sm={6} className="text-capitalize">
                      {order.status === "Pending" && (
                        <span className="badge bg-warning">{order.status}</span>
                      )}
                      {order.status === "Delivered" && (
                        <span className="badge bg-success">{order.status}</span>
                      )}
                      {order.status === "Shipped" && (
                        <span className="badge bg-info">{order.status}</span>
                      )}
                      {order.status === "Canceled" && (
                        <span className="badge bg-danger">{order.status}</span>
                      )}
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
        <Card className="mb-3">
          <Card.Body>
            <p>Product Details</p>
            <Row className="mb-3">
              <Col sm={3} className="mb-3">
                <img
                  src={require("../../assets/uploads/" + order.product.image)}
                  className="w-100"
                  alt=""
                />
              </Col>
              <Col sm={9}>
                <Row className="mb-3">
                  <Col sm={4} className="fw-bold text-uppercase">
                    product name
                  </Col>
                  <Col sm={8} className="text-capitalize">
                    {order.product.productName}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4} className="fw-bold text-uppercase">
                    Description
                  </Col>
                  <Col sm={8} className="text-capitalize">
                    {order.product.description}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={6}>
                <Row className="mb-3">
                  <Col sm={6} className="fw-bold text-uppercase">
                    Category
                  </Col>
                  <Col sm={6} className="text-capitalize">
                    {order.product.category}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={6} className="fw-bold text-uppercase">
                    price
                  </Col>
                  <Col sm={6} className="text-capitalize">
                    <FontAwesomeIcon icon={faPesoSign} size="xs" />
                    {order.product.price}
                  </Col>
                </Row>
              </Col>
              <Col sm={6}>
                <Row>
                  <Col sm={6}>
                    <Row className="mb-3">
                      <Col sm={6} className="fw-bold text-uppercase">
                        Stock
                      </Col>
                      <Col sm={6} className="text-capitalize">
                        {order.product.stock}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={6} className="fw-bold text-uppercase">
                        Unit
                      </Col>
                      <Col sm={6} className="text-capitalize">
                        {order.product.unit}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {type === "orders" ? (
          <Card>
            <Card.Body>
              <p>Buyer Details</p>
              <Row className="mb-3">
                <Col sm={6}>
                  <Row>
                    <Col sm={4} className="fw-bold text-uppercase">
                      Name
                    </Col>
                    <Col sm={8} className="text-capitalize mb-3">
                      {order.seller.firstName} {order.seller.lastName}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row>
                    {order.seller.address && (
                      <Row>
                        <Col sm={6} className="fw-bold text-uppercase">
                          Address
                        </Col>
                        <Col sm={6} className="text-capitalize">
                          {order.seller.address.houseNo}{" "}
                          {order.seller.address.street}{" "}
                          {order.seller.address.barangay}{" "}
                          {order.seller.address.city}{" "}
                          {order.seller.address.province}
                        </Col>
                      </Row>
                    )}
                  </Row>
                </Col>
              </Row>
              <Row>
                {order.seller.businessName && (
                  <Col sm={6} className="mb-3">
                    <Row>
                      <Col sm={6} className="fw-bold text-uppercase mb-3">
                        Business name
                      </Col>
                      <Col sm={6} className="text-capitalize">
                        {order.seller.businessName}
                      </Col>
                    </Row>
                  </Col>
                )}
                <Col sm={6} className="mb-3">
                  <Row>
                    <Col sm={4} className="fw-bold text-uppercase">
                      Mobile
                    </Col>
                    <Col sm={8} className="text-capitalize mb-3">
                      {order.seller.mobile}
                    </Col>
                  </Row>
                </Col>
                {order.seller.email && (
                  <Col sm={6} className="mb-3">
                    <Row>
                      <Col sm={4} className="fw-bold text-uppercase">
                        Email
                      </Col>
                      <Col sm={8} className="text-capitalize mb-3">
                        {order.seller.email}
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body>
              <p>Seller Details</p>
              <Row className="mb-3">
                <Col sm={6}>
                  <Row>
                    <Col sm={4} className="fw-bold text-uppercase">
                      Name
                    </Col>
                    <Col sm={8} className="text-capitalize mb-3">
                      {order.seller.firstName} {order.seller.lastName}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row>
                    {order.seller.address && (
                      <Row>
                        <Col sm={6} className="fw-bold text-uppercase">
                          Address
                        </Col>
                        <Col sm={6} className="text-capitalize">
                          {order.seller.address.houseNo}{" "}
                          {order.seller.address.street}{" "}
                          {order.seller.address.barangay}{" "}
                          {order.seller.address.city}{" "}
                          {order.seller.address.province}
                        </Col>
                      </Row>
                    )}
                  </Row>
                </Col>
              </Row>
              <Row>
                {order.seller.businessName && (
                  <Col sm={6} className="mb-3">
                    <Row>
                      <Col sm={6} className="fw-bold text-uppercase mb-3">
                        Business name
                      </Col>
                      <Col sm={6} className="text-capitalize">
                        {order.seller.businessName}
                      </Col>
                    </Row>
                  </Col>
                )}
                <Col sm={6} className="mb-3">
                  <Row>
                    <Col sm={4} className="fw-bold text-uppercase">
                      Mobile
                    </Col>
                    <Col sm={8} className="text-capitalize mb-3">
                      {order.seller.mobile}
                    </Col>
                  </Row>
                </Col>
                {order.seller.email && (
                  <Col sm={6} className="mb-3">
                    <Row>
                      <Col sm={4} className="fw-bold text-uppercase">
                        Email
                      </Col>
                      <Col sm={8} className="text-capitalize mb-3">
                        {order.seller.email}
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>
    );
  }
};

export default OrderDetails;
