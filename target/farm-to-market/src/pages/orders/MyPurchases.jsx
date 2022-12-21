import React, { useState, userEffect } from "react";
import { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { deliverOrder, myPurchases } from "../../services/order";
import { getUserInfo } from "../../services/userInf";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faEye,
  faPesoSign,
  faTrashAlt,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const MyPurchases = () => {
  const navigate = useNavigate();
  const [backup, setBackup] = useState(null);
  const [orders, setOrders] = useState(null);
  const userInfo = getUserInfo() && getUserInfo().data;
  const [range, setRange] = useState({
    qty: { min: "", max: "" },
    total: { min: "", max: "" },
  });

  useEffect(() => {
    if (userInfo) {
      getAllOrders();
    }
  }, []);

  const getAllOrders = () => {
    myPurchases(userInfo.user_id).then((res) => {
      if (res.data) {
        var qtyMax = Math.max.apply(
          Math,
          res.data.map((max) => {
            return max.quantity;
          })
        );
        var qtyMin = Math.min.apply(
          Math,
          res.data.map((min) => {
            return min.quantity;
          })
        );

        var totalMax = Math.max.apply(
          Math,
          res.data.map((max) => {
            return max.total;
          })
        );
        var totalMin = Math.min.apply(
          Math,
          res.data.map((min) => {
            return min.total;
          })
        );
        setRange({
          qty: { min: qtyMin, max: qtyMax },
          total: { min: totalMin, max: totalMax },
        });
        setBackup(res.data);
        setOrders(res.data);
      }
    });
  };

  const handleActions = (id, type) => {
    deliverOrder(id, type).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        getAllOrders();
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  //table filters
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleFilterName = (e) => {
    e.preventDefault();
    if (e.currentTarget.value === "") {
      return setOrders(orders);
    }

    var orderName = backup.filter(
      (order) =>
        order.buyer.firstName
          .toLowerCase()
          .includes(e.currentTarget.value.toLowerCase()) ||
        order.buyer.lastName
          .toLowerCase()
          .includes(e.currentTarget.value.toLowerCase())
    );

    setOrders(orderName);
  };

  const handleFilterProduct = (e) => {
    e.preventDefault();
    if (e.currentTarget.value === "") {
      setOrders(orders);
    } else {
      var orderName = backup.filter(
        (order) =>
          order.product.category
            .toLowerCase()
            .includes(e.currentTarget.value.toLowerCase()) ||
          order.product.description
            .toLowerCase()
            .includes(e.currentTarget.value.toLowerCase()) ||
          order.product.productName
            .toLowerCase()
            .includes(e.currentTarget.value.toLowerCase())
      );

      setOrders(orderName);
    }
  };

  const handleRangeFilter = (e, type) => {
    // e.preventDefault();
    if (type === "total") {
      var orderTotal = backup.filter(
        (order) => order.total >= e.currentTarget.value
      );
      setOrders(orderTotal);
    } else {
      var orderQuantity = backup.filter(
        (order) => order.quantity >= e.currentTarget.value
      );
      setOrders(orderQuantity);
    }
  };

  const handleSelect = (e, type) => {
    e.preventDefault();
    if (type === "status") {
      setStatusFilter(e.currentTarget.value);

      if (e.currentTarget.value === "all") {
        getAllOrders();
      } else {
        var orderStatus = backup.filter(
          (order) => order.status === e.currentTarget.value
        );

        setOrders(orderStatus);
      }
    } else {
      setPaymentTypeFilter(e.currentTarget.value);
      if (e.currentTarget.value === "all") {
        getAllOrders();
      } else {
        var orderPayment = backup.filter(
          (order) => order.paymentType === e.currentTarget.value
        );

        setOrders(orderPayment);
      }
    }
  };
  const handleOrderDetails = (id) => {
    navigate("/order/purchase/details/" + id);
  };

  if (orders) {
    return (
      <Container className="mb-4 mt-4">
        <div className="d-flex  mb-4">
          <h2>My Purchases</h2>
        </div>
        <Card>
          <Card.Body>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center">SELLER</th>
                    <th>PRODUCT</th>
                    <th className="text-center">QTY</th>
                    <th className="text-center">PAYMENT</th>
                    <th className="text-center">TOTAL</th>
                    <th className="text-center">STATUS</th>
                    <th className="text-center">ACTIONS</th>
                  </tr>
                  <tr>
                    <th>
                      <input className="w-100" onChange={handleFilterName} />
                    </th>
                    <th>
                      <input className="w-100" onChange={handleFilterProduct} />
                    </th>
                    <th>
                      <input
                        onChange={(e) => handleRangeFilter(e, "qty")}
                        className="w-100"
                        type="range"
                        min={range.qty.min}
                        max={range.qty.max}
                      />
                    </th>
                    <th>
                      <select
                        name=""
                        id=""
                        value={paymentTypeFilter}
                        onChange={(e) => handleSelect(e, "type")}
                      >
                        <option value="all">All</option>
                        <option value="cod">COD</option>
                        <option value="pickup">Pickup</option>
                        <option value="creditcard">Credit Card</option>
                        <option value="gcash">GCash</option>
                      </select>
                    </th>
                    <th>
                      <input
                        onChange={(e) => handleRangeFilter(e, "total")}
                        className="w-100"
                        min={range.total.min}
                        max={range.total.max}
                        type="range"
                      />
                    </th>
                    <th>
                      <select
                        name=""
                        id=""
                        value={statusFilter}
                        onChange={(e) => handleSelect(e, "status")}
                      >
                        <option value="all">All</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Returned">Returned</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </th>
                  </tr>
                </thead>
                {orders.length > 0 ? (
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="table-f-data">
                            <span className="text-capitalize">
                              {order.buyer.firstName} {order.buyer.lastName}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center table-f-image">
                            <img
                              src={require(`../../assets/uploads/${order.product.image}`)}
                              alt="Product"
                              width="100"
                              className="me-2"
                            />
                            <span className="img-desc">
                              {order.product.productName}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="table-f-data">{order.quantity}</div>
                        </td>
                        <td>
                          <span className="text-capitalize table-f-data">
                            {order.paymentType}
                          </span>
                        </td>
                        <td>
                          <span className="text-capitalize table-f-data">
                            <FontAwesomeIcon icon={faPesoSign} size="xs" />
                            {order.total}
                          </span>
                        </td>
                        <td>
                          <div className="table-f-data">
                            {order.status === "Pending" && (
                              <span className="badge bg-warning">
                                {order.status}
                              </span>
                            )}
                            {order.status === "Delivered" && (
                              <span className="badge bg-success">
                                {order.status}
                              </span>
                            )}
                            {order.status === "Shipped" && (
                              <span className="badge bg-info">
                                {order.status}
                              </span>
                            )}
                            {order.status === "Canceled" && (
                              <span className="badge bg-danger">
                                {order.status}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="table-f-data">
                            <Dropdown>
                              <Dropdown.Toggle></Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleOrderDetails(order.order_id)
                                  }
                                >
                                  <FontAwesomeIcon
                                    className="me-2 text-info"
                                    icon={faEye}
                                  />
                                  <span>View Details</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  disabled={
                                    order.status === "Shipped" ? true : false
                                  }
                                >
                                  <FontAwesomeIcon
                                    className="me-3 text-danger"
                                    icon={faTrashAlt}
                                  />
                                  <span>Delete</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleActions(order.order_id, "Canceled")
                                  }
                                  disabled={
                                    order.status === "Canceled" ||
                                    order.status === "Delivered"
                                      ? true
                                      : false
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faCancel}
                                    className="me-3 text-warning"
                                  />
                                  <span>
                                    {order.status === "Canceled"
                                      ? "Canceled"
                                      : "Cancel"}
                                  </span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleActions(order.order_id, "Delivered")
                                  }
                                  disabled={
                                    order.status === "Canceled" ||
                                    order.status === "Delivered"
                                      ? true
                                      : false
                                  }
                                >
                                  <FontAwesomeIcon
                                    className="me-3 text-success"
                                    icon={faTruckFast}
                                  />
                                  <span>Delivered</span>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody className="d-flex w-100">
                    <tr>
                      <th>No data found</th>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
};

export default MyPurchases;
